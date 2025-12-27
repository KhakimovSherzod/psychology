export function errorMiddleware(err: any, req: any, res: any, next: any) {
  console.error(err)
  return res.status(500).json({
    code: "UNEXPECTED_ERROR",
    message: "Unexpected error occurred"
  })
}