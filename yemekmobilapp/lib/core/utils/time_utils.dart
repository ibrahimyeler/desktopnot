class TimeUtils {
  TimeUtils._();

  /// Formats duration in seconds to MM:SS format
  static String formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  /// Formats duration in seconds to HH:MM:SS format
  static String formatDurationLong(int seconds) {
    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  /// Gets time remaining until target DateTime
  static Duration getTimeRemaining(DateTime target) {
    final now = DateTime.now();
    if (target.isBefore(now)) {
      return Duration.zero;
    }
    return target.difference(now);
  }

  /// Checks if target DateTime has passed
  static bool hasPassed(DateTime target) {
    return target.isBefore(DateTime.now());
  }

  /// Formats DateTime to readable string
  static String formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  /// Formats DateTime to date only string
  static String formatDate(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }
}

