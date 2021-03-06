import Gun from 'gun/gun'

import * as Utils from './Utils'
import { Node } from './Node'

import { Root } from './__mocks__/mockSchema'
import SetNode from './SetNode'

/** @type {Node<{}> */
let node

beforeEach(() => {
  node = new Node(Root, Gun().get(Math.random()))
})

/*
it('provides a subscriber with its current data on subscription', done => {
  expect.assertions(1)

  const data = {
    companyName: 'foo',
  }

  node.put(data).then(res => {
    if (!res.ok) {
      console.log(res)
    }

    node.on(nextData => {
      expect(nextData).toEqual(data)
      done()
    })
  })
})
*/
it('accepts null for edge puts', async () => {
  expect.assertions(1)

  const res = await node.put({
    mainUser: null,
  })

  expect(res.ok).toBe(true)
})

it('disallows non-null puts for edges', async () => {
  expect.assertions(1)

  const res = await node.put({
    mainUser: {
      name: 'john',
    },
  })

  expect(res.ok).toBe(false)
})

it('allows null for number puts', async () => {
  expect.assertions(1)

  const res = await node.put({
    numberOfUsers: null,
  })

  if (!res.ok) {
    console.log(res)
  }

  expect(res.ok).toBe(true)
})

it('allows null for string puts', async () => {
  expect.assertions(1)

  const res = await node.put({
    companyName: null,
  })

  if (!res.ok) {
    console.log(res)
  }

  expect(res.ok).toBe(true)
})

it('accepts number for number puts', async () => {
  expect.assertions(1)

  const res = await node.put({
    numberOfUsers: 3123,
  })

  if (!res.ok) {
    console.log(res)
  }

  expect(res.ok).toBe(true)
})

it('accepts strings for string puts', async () => {
  expect.assertions(1)

  const res = await node.put({
    companyName: 'foooxxx',
  })

  if (!res.ok) {
    console.log(res)
  }

  expect(res.ok).toBe(true)
})

it('accepts literals for literal puts', done => {
  expect.assertions(1)

  const Address = {
    [Utils.SCHEMA_NAME]: 'Address',
    city: {
      type: 'string',
      async onChange() {},
    },
    zip: {
      type: 'number',
      async onChange() {},
    },
  }

  const ExampleSchema = {
    [Utils.SCHEMA_NAME]: 'ExampleSchema',
    address: {
      type: { Address },
      async onChange() {},
    },
  }

  const addressPut = {
    address: {
      city: 'NY',
      zip: 11001,
    },
  }

  const myNode = new Node(ExampleSchema, Gun().get(Math.random()))

  let firstCall = true
  myNode.on(d => {
    if (firstCall) {
      firstCall = false
      return
    }

    expect(d).toEqual(addressPut)

    done()
  })

  myNode.put(addressPut).then(res => {
    if (!res.ok) {
      console.warn(res)
    }
  })
})

it("disallows puts for keys that don't exist in the schema", async () => {
  expect.assertions(2)

  const key = Math.random().toString()

  const res = await node.put({
    [key]: Math.random(),
  })

  expect(res.ok).toBe(false)
  expect(res.details[key]).toBeTruthy()
})

it('returns a non-ok response if a node of the wrong type given to an edge', async () => {
  expect.assertions(1)

  const mainUserEdge = node.get('mainUser')

  try {
    const res = await mainUserEdge.put({
      schema: {},
    })

    expect(res.ok).toBe(false)
  } catch (e) {
    console.log(Utils.reasonToString(e))
  }
})

it('calls a subscription when updating a primitive in a node', done => {
  expect.assertions(2)

  const data = {
    companyName: 'theCompany',
  }

  let firstCall = true

  const subscription = dataReceived => {
    // avoid failing the test via the initial subscription call
    if (firstCall) {
      firstCall = false
      expect(dataReceived).toEqual({
        cars: {},
        users: {},
      })
      return
    }

    expect(dataReceived).toEqual({
      ...data,
      cars: {},
      users: {},
    })
    done()
  }

  node.on(subscription)

  node.put(data)
})

it('calls a subscription when updating an edge in the node', done => {
  expect.assertions(1)

  const anUser = {
    name: Math.random().toString(),
  }

  let firstCall = true
  const subscription = nextData => {
    // avoid failing the test via the initial subscription call
    if (firstCall) {
      firstCall = false
      return
    }
    expect(nextData.mainUser).toEqual(anUser)
    done()
  }

  const users = node.get('users')

  if (!(users instanceof SetNode)) {
    console.log(users)
  }

  users.set(anUser).then(res => {
    if (!res.ok) {
      console.log(res)
      return
    }

    setTimeout(() => {
      node.on(subscription)
      const [userKey] = Object.keys(node.currentData.users)

      const edge = node.get('mainUser')

      const users = node.get('users')

      const theUser = users.get(userKey)

      edge
        .put(theUser)
        .then(res => {
          if (!res.ok) {
            console.log(res)
          }
        })
        .catch(e => {
          console.log(Utils.reasonToString(e))
        })
    }, 1000)
  })
})

it('calls a subscription when updating a set inside a node', done => {
  expect.assertions(1)

  const set = node.get('users')

  const anUserData = {
    name: Math.random().toString(),
  }

  let firstCall = true

  const subscription = nextData => {
    // avoid failing the test via the initial subscription call
    if (firstCall) {
      firstCall = false
      return
    }

    expect(Object.values(nextData.users)).toContainEqual(anUserData)

    done()
  }

  node.on(subscription)

  set.set(anUserData).then(res => {
    if (!res.ok) {
      console.log(res)
    }
  })
})

it('calls a subscription when updating a literal', done => {
  expect.assertions(1)

  const Address = {
    [Utils.SCHEMA_NAME]: 'Address',
    city: {
      type: 'string',
      async onChange() {},
    },
    zip: {
      type: 'number',
      async onChange() {},
    },
  }

  const ExampleSchema = {
    [Utils.SCHEMA_NAME]: 'ExampleSchema',
    address: {
      type: { Address },
      async onChange() {},
    },
  }

  const data = {
    address: {
      city: 'NY',
      zip: 11001,
    },
  }

  const myNode = new Node(ExampleSchema, Gun().get(Math.random()))

  let firstCall = true
  myNode.on(d => {
    if (firstCall) {
      firstCall = false
      return
    }
    expect(d).toEqual(data)

    done()
  })

  myNode.put(data).then(res => {
    if (!res.ok) {
      console.warn(res)
    }
  })
})
