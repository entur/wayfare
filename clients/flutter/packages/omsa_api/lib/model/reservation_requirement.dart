//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ReservationRequirement {
  /// Returns a new [ReservationRequirement] instance.
  ReservationRequirement({
    required this.type,
    required this.spotType,
    required this.reservationPolicy,
    this.sourceReservationPolicy,
    this.assetSelection,
    this.serviceJourney,
    this.fulfilledByAncillaries = const [],
  });

  String type;

  /// The kind of spot the reservation rule applies to.
  ReservationRequirementSpotTypeEnum spotType;

  ReservationPolicy reservationPolicy;

  /// Raw reservation policy from the upstream provider, when available.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? sourceReservationPolicy;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AssetSelection? assetSelection;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? serviceJourney;

  /// Ancillaries that can fulfill this reservation requirement when reservation is sold as a separate product.
  List<AncillaryReference> fulfilledByAncillaries;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReservationRequirement &&
          other.type == type &&
          other.spotType == spotType &&
          other.reservationPolicy == reservationPolicy &&
          other.sourceReservationPolicy == sourceReservationPolicy &&
          other.assetSelection == assetSelection &&
          other.serviceJourney == serviceJourney &&
          _deepEquality.equals(
              other.fulfilledByAncillaries, fulfilledByAncillaries);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (spotType.hashCode) +
      (reservationPolicy.hashCode) +
      (sourceReservationPolicy == null
          ? 0
          : sourceReservationPolicy!.hashCode) +
      (assetSelection == null ? 0 : assetSelection!.hashCode) +
      (serviceJourney == null ? 0 : serviceJourney!.hashCode) +
      (fulfilledByAncillaries.hashCode);

  @override
  String toString() =>
      'ReservationRequirement[type=$type, spotType=$spotType, reservationPolicy=$reservationPolicy, sourceReservationPolicy=$sourceReservationPolicy, assetSelection=$assetSelection, serviceJourney=$serviceJourney, fulfilledByAncillaries=$fulfilledByAncillaries]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'spotType'] = this.spotType;
    json[r'reservationPolicy'] = this.reservationPolicy;
    if (this.sourceReservationPolicy != null) {
      json[r'sourceReservationPolicy'] = this.sourceReservationPolicy;
    } else {
      json[r'sourceReservationPolicy'] = null;
    }
    if (this.assetSelection != null) {
      json[r'assetSelection'] = this.assetSelection;
    } else {
      json[r'assetSelection'] = null;
    }
    if (this.serviceJourney != null) {
      json[r'serviceJourney'] = this.serviceJourney;
    } else {
      json[r'serviceJourney'] = null;
    }
    json[r'fulfilledByAncillaries'] = this.fulfilledByAncillaries;
    return json;
  }

  /// Returns a new [ReservationRequirement] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ReservationRequirement? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ReservationRequirement[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ReservationRequirement[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ReservationRequirement(
        type: mapValueOfType<String>(json, r'type')!,
        spotType:
            ReservationRequirementSpotTypeEnum.fromJson(json[r'spotType'])!,
        reservationPolicy:
            ReservationPolicy.fromJson(json[r'reservationPolicy'])!,
        sourceReservationPolicy:
            mapValueOfType<String>(json, r'sourceReservationPolicy'),
        assetSelection: AssetSelection.fromJson(json[r'assetSelection']),
        serviceJourney: mapValueOfType<String>(json, r'serviceJourney'),
        fulfilledByAncillaries:
            AncillaryReference.listFromJson(json[r'fulfilledByAncillaries']),
      );
    }
    return null;
  }

  static List<ReservationRequirement> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ReservationRequirement>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ReservationRequirement.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ReservationRequirement> mapFromJson(dynamic json) {
    final map = <String, ReservationRequirement>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ReservationRequirement.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ReservationRequirement-objects as value to a dart map
  static Map<String, List<ReservationRequirement>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ReservationRequirement>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ReservationRequirement.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'type',
    'spotType',
    'reservationPolicy',
  };
}

/// The kind of spot the reservation rule applies to.
class ReservationRequirementSpotTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ReservationRequirementSpotTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const VEHICLE_SPOT =
      ReservationRequirementSpotTypeEnum._(r'VEHICLE_SPOT');
  static const PASSENGER_SPOT =
      ReservationRequirementSpotTypeEnum._(r'PASSENGER_SPOT');
  static const LUGGAGE_SPOT =
      ReservationRequirementSpotTypeEnum._(r'LUGGAGE_SPOT');

  /// List of all possible values in this [enum][ReservationRequirementSpotTypeEnum].
  static const values = <ReservationRequirementSpotTypeEnum>[
    VEHICLE_SPOT,
    PASSENGER_SPOT,
    LUGGAGE_SPOT,
  ];

  static ReservationRequirementSpotTypeEnum? fromJson(dynamic value) =>
      ReservationRequirementSpotTypeEnumTypeTransformer().decode(value);

  static List<ReservationRequirementSpotTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ReservationRequirementSpotTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ReservationRequirementSpotTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ReservationRequirementSpotTypeEnum] to String,
/// and [decode] dynamic data back to [ReservationRequirementSpotTypeEnum].
class ReservationRequirementSpotTypeEnumTypeTransformer {
  factory ReservationRequirementSpotTypeEnumTypeTransformer() =>
      _instance ??= const ReservationRequirementSpotTypeEnumTypeTransformer._();

  const ReservationRequirementSpotTypeEnumTypeTransformer._();

  String encode(ReservationRequirementSpotTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ReservationRequirementSpotTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ReservationRequirementSpotTypeEnum? decode(dynamic data,
      {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'VEHICLE_SPOT':
          return ReservationRequirementSpotTypeEnum.VEHICLE_SPOT;
        case r'PASSENGER_SPOT':
          return ReservationRequirementSpotTypeEnum.PASSENGER_SPOT;
        case r'LUGGAGE_SPOT':
          return ReservationRequirementSpotTypeEnum.LUGGAGE_SPOT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ReservationRequirementSpotTypeEnumTypeTransformer] instance.
  static ReservationRequirementSpotTypeEnumTypeTransformer? _instance;
}
