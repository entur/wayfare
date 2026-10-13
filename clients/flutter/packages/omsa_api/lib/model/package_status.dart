//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// The life-cycle state of the package (from NEW to ENDED)<br> _OFFERED_ the package is offered<br> _SELECTED_ the package is selected to modify<br> _PENDING_ the purchase of the package is not confirmed (the end user has shown intentions to purchase this offer), must be finalized with the package-confirm operation<br> _CONFIRMED_ a finalized package ('purchased'). Both parties agreed to deliver services in return of payment<br> _CANCELLED_ the package is cancelled after it is purchased. The agreement will specify whether there is a refund, or under which conditions<br> _EXPIRED_ the MP didn't respond on time, the package offer has been expired<br> _STARTED_ the package is started, the <u>trip execution</u> module is needed now to manage the execution of the package<br> _ENDED_ the package has ended, the trip has been executed<br> _RELEASED_ for internal archiving, the package has not been purchased.<br>
class PackageStatus {
  /// Instantiate a new enum with the provided [value].
  const PackageStatus._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const OFFERED = PackageStatus._(r'OFFERED');
  static const SELECTED = PackageStatus._(r'SELECTED');
  static const PENDING = PackageStatus._(r'PENDING');
  static const CONFIRMED = PackageStatus._(r'CONFIRMED');
  static const RELEASED = PackageStatus._(r'RELEASED');
  static const EXPIRED = PackageStatus._(r'EXPIRED');
  static const CANCELLED = PackageStatus._(r'CANCELLED');
  static const REFUND_CLAIMED = PackageStatus._(r'REFUND_CLAIMED');
  static const REFUNDED = PackageStatus._(r'REFUNDED');
  static const STARTED = PackageStatus._(r'STARTED');
  static const ENDED = PackageStatus._(r'ENDED');

  /// List of all possible values in this [enum][PackageStatus].
  static const values = <PackageStatus>[
    OFFERED,
    SELECTED,
    PENDING,
    CONFIRMED,
    RELEASED,
    EXPIRED,
    CANCELLED,
    REFUND_CLAIMED,
    REFUNDED,
    STARTED,
    ENDED,
  ];

  static PackageStatus? fromJson(dynamic value) =>
      PackageStatusTypeTransformer().decode(value);

  static List<PackageStatus> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageStatus>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageStatus.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PackageStatus] to String,
/// and [decode] dynamic data back to [PackageStatus].
class PackageStatusTypeTransformer {
  factory PackageStatusTypeTransformer() =>
      _instance ??= const PackageStatusTypeTransformer._();

  const PackageStatusTypeTransformer._();

  String encode(PackageStatus data) => data.value;

  /// Decodes a [dynamic value][data] to a PackageStatus.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PackageStatus? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'OFFERED':
          return PackageStatus.OFFERED;
        case r'SELECTED':
          return PackageStatus.SELECTED;
        case r'PENDING':
          return PackageStatus.PENDING;
        case r'CONFIRMED':
          return PackageStatus.CONFIRMED;
        case r'RELEASED':
          return PackageStatus.RELEASED;
        case r'EXPIRED':
          return PackageStatus.EXPIRED;
        case r'CANCELLED':
          return PackageStatus.CANCELLED;
        case r'REFUND_CLAIMED':
          return PackageStatus.REFUND_CLAIMED;
        case r'REFUNDED':
          return PackageStatus.REFUNDED;
        case r'STARTED':
          return PackageStatus.STARTED;
        case r'ENDED':
          return PackageStatus.ENDED;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PackageStatusTypeTransformer] instance.
  static PackageStatusTypeTransformer? _instance;
}
