//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// status of a leg<br> _NOT_STARTED_ the leg is not started, initial state<br> _PREPARING_ the _PREPARE_ operation has been received<br> _PREPARED_ the leg is ready to use<br> _IN_USE_ the travelers are on their way<br> _PAUSED_ the asset is paused<br> _ENDED_ the travelers have arrived at their destination<br> _ISSUE_REPORTED_ due to an issue, there is (temporarily) no progress to report, when the issue isn't solved, this is a final state<br> _CANCELLED_ the leg has been cancelled, before execution<br> _ABENDED_ the leg is abnormally ended (e.g. due to an issue)
class LegState {
  /// Instantiate a new enum with the provided [value].
  const LegState._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NOT_STARTED = LegState._(r'NOT_STARTED');
  static const PREPARING = LegState._(r'PREPARING');
  static const PREPARED = LegState._(r'PREPARED');
  static const IN_USE = LegState._(r'IN_USE');
  static const PAUSED = LegState._(r'PAUSED');
  static const ENDED = LegState._(r'ENDED');
  static const ISSUE_REPORTED = LegState._(r'ISSUE_REPORTED');
  static const CANCELLED = LegState._(r'CANCELLED');
  static const ABENDED = LegState._(r'ABENDED');

  /// List of all possible values in this [enum][LegState].
  static const values = <LegState>[
    NOT_STARTED,
    PREPARING,
    PREPARED,
    IN_USE,
    PAUSED,
    ENDED,
    ISSUE_REPORTED,
    CANCELLED,
    ABENDED,
  ];

  static LegState? fromJson(dynamic value) =>
      LegStateTypeTransformer().decode(value);

  static List<LegState> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <LegState>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = LegState.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [LegState] to String,
/// and [decode] dynamic data back to [LegState].
class LegStateTypeTransformer {
  factory LegStateTypeTransformer() =>
      _instance ??= const LegStateTypeTransformer._();

  const LegStateTypeTransformer._();

  String encode(LegState data) => data.value;

  /// Decodes a [dynamic value][data] to a LegState.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  LegState? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NOT_STARTED':
          return LegState.NOT_STARTED;
        case r'PREPARING':
          return LegState.PREPARING;
        case r'PREPARED':
          return LegState.PREPARED;
        case r'IN_USE':
          return LegState.IN_USE;
        case r'PAUSED':
          return LegState.PAUSED;
        case r'ENDED':
          return LegState.ENDED;
        case r'ISSUE_REPORTED':
          return LegState.ISSUE_REPORTED;
        case r'CANCELLED':
          return LegState.CANCELLED;
        case r'ABENDED':
          return LegState.ABENDED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [LegStateTypeTransformer] instance.
  static LegStateTypeTransformer? _instance;
}
