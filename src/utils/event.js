/**
 * subscriptions data format:
 * { eventType: { id: callback } }
 */
const subscriptions = { }
const getNextUniqueId = getIdGenerator()

function subscribe(eventType, callback, namespace = '') {
    const id = getNextUniqueId()
    const eventKey = namespace + eventType;

    if(!subscriptions[eventKey])
        subscriptions[eventKey] = { }

    subscriptions[eventKey][id] = callback

    return {
        unsubscribe: () => {
            delete subscriptions[eventKey][id]
            if(Object.keys(subscriptions[eventKey]).length === 0) delete subscriptions[eventKey]
        }
    }
}

function publish(eventType, arg, namespace = '') {
    const eventKey = namespace + eventType;

    if(!subscriptions[eventKey])
        return

    Object.keys(subscriptions[eventKey]).forEach(key => subscriptions[eventKey][key](arg))
}

function getIdGenerator() {
    let lastId = 0

    return function getNextUniqueId() {
        lastId += 1
        return lastId
    }
}

module.exports = { publish, subscribe }
