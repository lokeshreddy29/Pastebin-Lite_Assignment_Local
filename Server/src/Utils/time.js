
// used ONLY for expiry logic to support deterministic testing
const getNowMs = (req) => {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers["x-test-now-ms"]
    if (testNow) return Number(testNow)
  }
  return Date.now()
}

export default getNowMs