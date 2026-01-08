import { DatabaseError } from '@/shared/errors/DatabaseError'
import { UserMappingError } from '@/shared/errors/UserMappingError'
import { errorMiddleware } from '../error.middleware'

describe('errorMiddleware', () => {
  let res: any
  let req: any
  let next: jest.Mock
  let status: jest.Mock
  let json: jest.Mock

  beforeEach(() => {
    // Mock Express res.status().json() chain
    json = jest.fn() // Mock the json function
    status = jest.fn(() => ({ json })) // Mock status, which returns the json mock
    res = { status } // Mock the response object with a status method
    req = {} // Mock the request (empty for now)
    next = jest.fn() // Mock next()

    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should handle DatabaseError correctly', () => {
    const err = new DatabaseError('DB connection failed')

    // Call the middleware with the error
    errorMiddleware(err, req, res, next)

    // Log the output to see the result
    console.log('Status:', status.mock.calls) // Logs the arguments passed to status()
    console.log('JSON:', json.mock.calls) // Logs the arguments passed to json()

    // Check if status() was called with 500
    expect(status).toHaveBeenCalledWith(500)

    // Check if json() was called with the expected object
    expect(json).toHaveBeenCalledWith({
      code: 'DATABASE_ERROR',
      message: 'Database error: DB connection failed',
    })

    // Optionally, you can capture the exact response:
    const response = json.mock.calls[0][0] // Get the first call argument of json()
    console.log('Response:', response) // This will show you the actual response object

    // Validate the exact response returned from middleware
    expect(response).toEqual({
      code: 'DATABASE_ERROR',
      message: 'Database error: DB connection failed',
    })
  })

  it('should handle UserMappingError correctly', () => {
    const err = new UserMappingError('Failed to map user')

    // Call the middleware with the error
    errorMiddleware(err, req, res, next)

    // Log the output to see the result
    console.log('Status:', status.mock.calls) // Logs the arguments passed to status()
    console.log('JSON:', json.mock.calls) // Logs the arguments passed to json()

    // Check if status() was called with 500
    expect(status).toHaveBeenCalledWith(500)

    // Check if json() was called with the expected object
    expect(json).toHaveBeenCalledWith({
      code: 'USER_MAPPING_ERROR',
      message: 'User mapping error: Failed to map user',
    })
  })

  it('should handle generic Error correctly', () => {
    const err = new Error('Something went wrong')

    // Call the middleware with the error
    errorMiddleware(err, req, res, next)

    // Log the output to see the result
    console.log('Status:', status.mock.calls) // Logs the arguments passed to status()
    console.log('JSON:', json.mock.calls) // Logs the arguments passed to json()

    // Check if status() was called with 500
    expect(status).toHaveBeenCalledWith(500)

    // Check if json() was called with the expected object
    expect(json).toHaveBeenCalledWith({
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    })
  })

  it('should handle unknown thrown values correctly', () => {
    const err = 'Some string error'

    // Call the middleware with the error
    errorMiddleware(err, req, res, next)

    // Log the output to see the result
    console.log('Status:', status.mock.calls) // Logs the arguments passed to status()
    console.log('JSON:', json.mock.calls) // Logs the arguments passed to json()

    // Check if status() was called with 500
    expect(status).toHaveBeenCalledWith(500)

    // Check if json() was called with the expected object
    expect(json).toHaveBeenCalledWith({
      code: 'UNEXPECTED_ERROR',
      message: 'Unexpected error occurred',
    })
  })
})
