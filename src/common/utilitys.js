export function GetHoursBetweenTwoDates(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0
  }

  var milliseconds = Math.abs(startDate - endDate)
  var hours = milliseconds / 36e5
  return hours
}

export function GetMinutesBetweenTwoDates(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0
  }

  var milliseconds = Math.abs(startDate - endDate)
  var minutes = milliseconds / (60 * 1000)
  return minutes
}
