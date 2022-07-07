//NOT USED
//provides a unique id unsing singleton pattern : Elliot 7/6/2022
class IdGenerator {
    constructor() {
        this.id = 0;
    }

    getId() {
        return this.id++;
    }
}
// Makes it a singleton hopefully : Elliot 7/6/2022
this.IdGeneratorSingleton = !(typeof IdGeneratorSingleton === IdGenerator)
    ? new IdGenerator()
    : IdGeneratorSingleton;

export { IdGeneratorSingleton };
