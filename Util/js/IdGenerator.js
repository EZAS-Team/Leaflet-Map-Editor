//provides a unique id
class IdGenerator {
    constructor() {
        this.id = 0;
    }

    getId() {
        return this.id++;
    }
}
