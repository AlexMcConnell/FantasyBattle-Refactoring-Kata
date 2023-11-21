import { Inventory } from '../src/Inventory';
import { Stats } from '../src/Stats';
import { SimpleEnemy } from '../src/SimpleEnemy';
import { Player } from '../src/Player';
import { Equipment } from "../src/Equipment";
import { BasicItem } from "../src/BasicItem";
import { SimpleArmor } from "../src/SimpleArmor";
import { BasicBuff } from "../src/BasicBuff";

describe('Player', () => {
    let playerStats: Stats;
    let player: Player;
    let enemy: SimpleEnemy;

    describe('calculateDamage', () => {
        describe("when totalSoak is 0", () => {
            beforeEach(() => {
                playerStats = new Stats(0);
                enemy = buildEnemy(0, []);
            });

            describe("but leftHand equipment has values", () => {
                it("returns the leftHand base damage times leftHand modifier", () => {
                    const item = new BasicItem("leftHand", 234, 645);
                    const equipment = buildEquipment({ leftHand: item });
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(item.baseDamage * item.damageModifier);
                });
            });

            describe("but rightHand equipment has values", () => {
                it("returns the rightHand base damage times rightHand modifier", () => {
                    const item = new BasicItem("rightHand", 857, 398);
                    const equipment = buildEquipment({ rightHand: item });
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(item.baseDamage * item.damageModifier);
                });
            });

            describe("but head equipment has values", () => {
                it("returns the head base damage times head modifier", () => {
                    const item = new BasicItem("head", 834, 384);
                    const equipment = buildEquipment({ head: item });
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(item.baseDamage * item.damageModifier);
                });
            });

            describe("but feet equipment has values", () => {
                it("returns the feet base damage times feet modifier", () => {
                    const item = new BasicItem("feet", 283, 549);
                    const equipment = buildEquipment({ feet: item });
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(item.baseDamage * item.damageModifier);
                });
            });

            describe("but chest equipment has values", () => {
                it("returns the chest base damage times chest modifier", () => {
                    const item = new BasicItem("chest", 6, 9);
                    const expected = 54;
                    const equipment = buildEquipment({ chest: item });
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(expected);
                });
            });

            describe("but strength has value and some items have base damage", () => {
                it("returns 1/10th of strength multiplied by the sum of the base damage", () => {
                    const item = new BasicItem("leftHand", 23, 0);
                    const equipment = buildEquipment({ leftHand: item });
                    playerStats = new Stats(40);
                    player = new Player(equipment, playerStats);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(item.baseDamage * playerStats.strength * 0.1);
                });
            });

            describe("and totalDamage should round down", () => {
                it("returns totalDamage rounded down", () => {
                    setTotalDamage(4.499);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(4);
                });
            });

            describe("and totalDamage should round up", () => {
                it("returns totalDamage rounded up", () => {
                    setTotalDamage(4.5);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(5);
                });
            });
        });

        describe("when totalDamage is 100", () => {
            beforeEach(() => setTotalDamage(100));

            describe('and target is SimpleEnemy', () => {
                it("returns totalDamage minus totalSoak", () => {
                    const soakFromArmor = 4;
                    const soakFromBuffs = 2 + 3 + 1;
                    const totalSoak = soakFromArmor * soakFromBuffs;
                    const buffs = [new BasicBuff(2, null!), new BasicBuff(3, null!)];
                    enemy = buildEnemy(soakFromArmor, buffs);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(100 - totalSoak);
                });

                it("returns 0 if totalDamage minus totalSoak is less than 0", () => {
                    const buffs = [new BasicBuff(20, null!), new BasicBuff(30, null!)];
                    enemy = buildEnemy(40, buffs);

                    const damage = player.calculateDamage(enemy);

                    expect(damage.amount).toBe(0);
                });

                describe("and totalSoak should round down", () => {

                });

                describe("and totalSoak should round up", () => {

                });
            });
        });
    });

    function setTotalDamage(damage: number) {
        const leftHand = new BasicItem("leftHand", damage, 0);
        const equipment = buildEquipment({ leftHand });
        playerStats = new Stats(10);
        player = new Player(equipment, playerStats);
    }

    function buildEnemy(armorSoak: number, enemyBuffs: BasicBuff[]) {
        const armor = new SimpleArmor(armorSoak);
        return new SimpleEnemy(armor, enemyBuffs);
    }

    function buildEquipment(baseDamages: { leftHand?: BasicItem, rightHand?: BasicItem, head?: BasicItem, feet?: BasicItem, chest?: BasicItem }): Inventory {
        const genericItem = new BasicItem("genericItem", 0, 0);
        const equipment = new Equipment(
          baseDamages.leftHand ?? genericItem,
          baseDamages.rightHand ?? genericItem,
          baseDamages.head ?? genericItem,
          baseDamages.feet ?? genericItem,
          baseDamages.chest ?? genericItem,
        );
        return new Inventory(equipment);
    }
})
