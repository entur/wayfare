//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class JobControlOptions {
  /// Instantiate a new enum with the provided [value].
  const JobControlOptions._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const syncExecute = JobControlOptions._(r'sync-execute');
  static const asyncExecute = JobControlOptions._(r'async-execute');
  static const dismiss = JobControlOptions._(r'dismiss');

  /// List of all possible values in this [enum][JobControlOptions].
  static const values = <JobControlOptions>[
    syncExecute,
    asyncExecute,
    dismiss,
  ];

  static JobControlOptions? fromJson(dynamic value) =>
      JobControlOptionsTypeTransformer().decode(value);

  static List<JobControlOptions> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <JobControlOptions>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = JobControlOptions.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [JobControlOptions] to String,
/// and [decode] dynamic data back to [JobControlOptions].
class JobControlOptionsTypeTransformer {
  factory JobControlOptionsTypeTransformer() =>
      _instance ??= const JobControlOptionsTypeTransformer._();

  const JobControlOptionsTypeTransformer._();

  String encode(JobControlOptions data) => data.value;

  /// Decodes a [dynamic value][data] to a JobControlOptions.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  JobControlOptions? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'sync-execute':
          return JobControlOptions.syncExecute;
        case r'async-execute':
          return JobControlOptions.asyncExecute;
        case r'dismiss':
          return JobControlOptions.dismiss;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [JobControlOptionsTypeTransformer] instance.
  static JobControlOptionsTypeTransformer? _instance;
}
