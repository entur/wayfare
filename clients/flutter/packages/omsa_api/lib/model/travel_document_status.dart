//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// The lifecycle status of a travel document.<br> _PENDING_ the document is being processed or awaiting distribution pickup<br> _ACTIVE_ the document is ready for use<br> _FAILED_ the document distribution failed<br> _EXPIRED_ the document has expired<br> _CANCELLED_ the document has been cancelled<br>
class TravelDocumentStatus {
  /// Instantiate a new enum with the provided [value].
  const TravelDocumentStatus._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PENDING = TravelDocumentStatus._(r'PENDING');
  static const ACTIVE = TravelDocumentStatus._(r'ACTIVE');
  static const FAILED = TravelDocumentStatus._(r'FAILED');
  static const EXPIRED = TravelDocumentStatus._(r'EXPIRED');
  static const CANCELLED = TravelDocumentStatus._(r'CANCELLED');

  /// List of all possible values in this [enum][TravelDocumentStatus].
  static const values = <TravelDocumentStatus>[
    PENDING,
    ACTIVE,
    FAILED,
    EXPIRED,
    CANCELLED,
  ];

  static TravelDocumentStatus? fromJson(dynamic value) =>
      TravelDocumentStatusTypeTransformer().decode(value);

  static List<TravelDocumentStatus> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelDocumentStatus>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelDocumentStatus.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [TravelDocumentStatus] to String,
/// and [decode] dynamic data back to [TravelDocumentStatus].
class TravelDocumentStatusTypeTransformer {
  factory TravelDocumentStatusTypeTransformer() =>
      _instance ??= const TravelDocumentStatusTypeTransformer._();

  const TravelDocumentStatusTypeTransformer._();

  String encode(TravelDocumentStatus data) => data.value;

  /// Decodes a [dynamic value][data] to a TravelDocumentStatus.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  TravelDocumentStatus? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PENDING':
          return TravelDocumentStatus.PENDING;
        case r'ACTIVE':
          return TravelDocumentStatus.ACTIVE;
        case r'FAILED':
          return TravelDocumentStatus.FAILED;
        case r'EXPIRED':
          return TravelDocumentStatus.EXPIRED;
        case r'CANCELLED':
          return TravelDocumentStatus.CANCELLED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [TravelDocumentStatusTypeTransformer] instance.
  static TravelDocumentStatusTypeTransformer? _instance;
}
