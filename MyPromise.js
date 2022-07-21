const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'  
}

class MyPromise {

    #thenCbs = []
    #catchCbs = []
    #state = STATE.PENDING
    #value
    #onSuccessBind = this.#onSuccess.bind(this)
    #onFailBind = this.#onFail.bind(this)

    constructor(cb) {
        try {
            cb(this.#onSuccessBind, this.#onFailBind)
        } catch (e) {
            this.#onFail(e)
        }
    }

    #runCallBacks() {
        if(this.#state === STATE.FULFILLED) {
            this.#thenCbs.forEach(callback => {
                callback(this.#value)
            })
            this.#thenCbs = []
        } 
        if(this.#state === STATE.REJECTED) {
            this.#catchCbs.forEach(callback => {
                callback(this.#value)
            })
            this.#catchCbs = []
        }
    }

    #onSuccess(value) {
        if(this.#state !== STATE.PENDING) return
        this.#value = value
        this.#state = STATE.FULFILLED
        this.#runCallBacks()
    } 

    #onFail(value) {
        if(this.#state !== STATE.PENDING) return
        this.#value = value
        this.#state = STATE.REJECTED
        this.#runCallBacks()
    }

    then(thenCb, catchCb) {
        return new MyPromise((resolve, reject) => {
            this.#thenCbs.push(result => {
                if(thenCb == null) {
                    resolve(result)
                    return
                }
                try { 
                    resolve(thenCb(result))
                } catch {
                    reject(error)
                }
            })

            this.#catchCbs.push(result => {
                if(catchCb == null) {
                    reject(result)
                    return
                }
                try { 
                    resolve(catchCb(result))
                } catch {
                    reject(error)
                }
            })

            this.#runCallBacks()
        })
    }

    catch(cb) {
        this.then(undefined, cb)
    }
    finally(cb){}

}

module.exports = MyPromise

