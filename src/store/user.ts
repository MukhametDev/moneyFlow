import { makeAutoObservable } from "mobx";

class User {
    userId: string = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5'
    constructor() {
        makeAutoObservable(this)
    }
}

export const user: User = new User();