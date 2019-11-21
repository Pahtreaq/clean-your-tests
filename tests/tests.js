const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {
  afterEach,
  beforeEach,
  describe,
  it
} = require('mocha')
const employee = require('./employee')
const products = require('./products')
const pricing = require('../pricing')

chai.use(sinonChai)
const {
  expect
} = chai

describe('formatPrice', () => {
  it('returns a truncated price with two decimal places not rounded when given a number with multiple places', () => {
    const x = 15.1566663
    const formattedPrice = pricing.formatPrice(15.1566663)

    expect(formattedPrice).to.equal(15.15)
  })
})

describe('commuterTrain', () => {
  it('calculates the employee fare on the commuter train, minus the contribution from the employer', () => {
    const commuterTrain = {
      price: 84.75 - (products.employerContribution.contribution)
    }

    expect(commuterTrain).to.equal(9.75)
  })
})

describe('commuterParking', () => {
  it('calculates the fee payable by the employee for parking, short of the employer contribution', () => {
    const commuterParking = {
      price: 250 - (products.employerContribution.contribution)
    }
    expect(commuterParking).to.equal(175)
  })
})
describe('getEmployerContribution', () => {})
it('returns a truncated price with two decimal places not rounded when given a number with multiple places', () => {})

describe('calculatesLTDPrice', () => {
      it('returns the LTD price minus the employer contribution', () => {
        const selectedOptions = {
          familyMembersToCover: [ee]
        }
        const price = pricing.calculateLTDPrice(products.voluntaryLife, employee, selectedOptions)
      })

      describe('calculateProductPrice', () => {
            let calculateVolLifePriceSpy
            let getEmployerContributionSpy
            let formatPriceSpy
            let calculateLTDPriceSpy
            let sandbox

            beforeEach(() => {
              sandbox = sinon.createSandbox()

              calculateVolLifePriceSpy = sandbox.spy(pricing, 'calculateVolLifePrice')
              getEmployerContributionSpy = sandbox.spy(pricing, 'getEmployerContribution')
              formatPriceSpy = sandbox.spy(pricing, 'formatPrice')
              calculateLTDPriceSpy = sandbox.spy(pricing, 'calculateLTDPrice')
            })
            afterEach(() => {
              sandbox.restore()
            })

            it('returns the price for a voluntary life product for a single employee', () => {
              const selectedOptions = {
                familyMembersToCover: ['ee'],
                coverageLevel: [{
                  role: 'ee',
                  coverage: 125000
                }],
              }
              const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)
              expect(price).to.equal(39.37)
              expect(calculateVolLifePriceSpy).to.have.callCounts(1)
              expect(getEmployerContributionSpy).to.have.callCounts(1)
              expect(formatPriceSpy).to.have.callCounts(1)
              expect(calculateLTDPriceSpy).to.have.callCount(0)
            })

            describe('calculateProductPrice', () => {
              it('returns the price for a voluntary life product for a single employee', () => {
                const selectedOptions = {
                  familyMembersToCover: ['ee'],
                  coverageLevel: [{
                    role: 'ee',
                    coverage: 125000
                  }],
                }
                const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

                expect(price).to.equal(39.37)
              })
              const selectedOptions = {
                benefit: 'train'
              }
              it('returns the price for a voluntary life product for an employee with a spouse', () => {
                const selectedOptions = {
                  familyMembersToCover: ['ee', 'sp'],
                  coverageLevel: [{
                      role: 'ee',
                      coverage: 200000
                    },
                    {
                      role: 'sp',
                      coverage: 75000
                    },
                  ],
                }
                const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

                expect(price).to.equal(71.09)
              })

              it('returns the price for a disability product for an employee', () => {
                const selectedOptions = {
                  familyMembersToCover: ['ee']
                }
                const price = pricing.calculateProductPrice(products.longTermDisability, employee, selectedOptions)

                expect(price).to.equal(22.04)
              })

              it('throws an error on unknown product type', () => {
                const unknownProduct = {
                  type: 'vision'
                }
                expect(() => pricing.calculateProductPrice(unknownProduct, {}, {})).to.throw('Unknown product type: vision')
              })
            })