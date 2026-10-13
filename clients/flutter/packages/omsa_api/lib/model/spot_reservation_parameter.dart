//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SpotReservationParameter {
  /// Returns a new [SpotReservationParameter] instance.
  SpotReservationParameter({
    required this.type,
    required this.spotType,
    this.deck,
    this.space,
    required this.spot,
    this.width,
    this.length,
    this.height,
    this.fuel,
    this.weight,
    this.mode,
  });

  String type;

  SpotReservationParameterSpotTypeEnum spotType;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? deck;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? space;

  /// For LUGGAGE_SPOT and VEHICLE_SPOT, supported values are: HANDBAG, HAND_LUGGAGE, SMALL_SUITCASE, SUITCASE, TRUNK, OVERSIZE_ITEM, BICYCLE, SPORTING_EQUIPMENT, SKIS, MUSICAL_INSTRUMENT, PUSH_CHAIR, MOTORIZED_WHEELCHAIR, LARGE_MOTORIZED_WHEELCHAIR, WHEELCHAIR, SMALL_ANIMAL, ANIMAL, GAME, MOTORCYCLE, OTHER, GUIDE_DOG. Unknown values are ignored. Use VEHICLE_SPOT for vehicles transported as cargo (e.g. motorcycle on a ferry). For PASSENGER_SPOT, the value is an operator-specific seat identifier and is not used for requirement mapping.
  String spot;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? width;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? length;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? height;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? fuel;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? weight;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Mode? mode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SpotReservationParameter &&
          other.type == type &&
          other.spotType == spotType &&
          other.deck == deck &&
          other.space == space &&
          other.spot == spot &&
          other.width == width &&
          other.length == length &&
          other.height == height &&
          other.fuel == fuel &&
          other.weight == weight &&
          other.mode == mode;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (spotType.hashCode) +
      (deck == null ? 0 : deck!.hashCode) +
      (space == null ? 0 : space!.hashCode) +
      (spot.hashCode) +
      (width == null ? 0 : width!.hashCode) +
      (length == null ? 0 : length!.hashCode) +
      (height == null ? 0 : height!.hashCode) +
      (fuel == null ? 0 : fuel!.hashCode) +
      (weight == null ? 0 : weight!.hashCode) +
      (mode == null ? 0 : mode!.hashCode);

  @override
  String toString() =>
      'SpotReservationParameter[type=$type, spotType=$spotType, deck=$deck, space=$space, spot=$spot, width=$width, length=$length, height=$height, fuel=$fuel, weight=$weight, mode=$mode]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'spotType'] = this.spotType;
    if (this.deck != null) {
      json[r'deck'] = this.deck;
    } else {
      json[r'deck'] = null;
    }
    if (this.space != null) {
      json[r'space'] = this.space;
    } else {
      json[r'space'] = null;
    }
    json[r'spot'] = this.spot;
    if (this.width != null) {
      json[r'width'] = this.width;
    } else {
      json[r'width'] = null;
    }
    if (this.length != null) {
      json[r'length'] = this.length;
    } else {
      json[r'length'] = null;
    }
    if (this.height != null) {
      json[r'height'] = this.height;
    } else {
      json[r'height'] = null;
    }
    if (this.fuel != null) {
      json[r'fuel'] = this.fuel;
    } else {
      json[r'fuel'] = null;
    }
    if (this.weight != null) {
      json[r'weight'] = this.weight;
    } else {
      json[r'weight'] = null;
    }
    if (this.mode != null) {
      json[r'mode'] = this.mode;
    } else {
      json[r'mode'] = null;
    }
    return json;
  }

  /// Returns a new [SpotReservationParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SpotReservationParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "SpotReservationParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "SpotReservationParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SpotReservationParameter(
        type: mapValueOfType<String>(json, r'type')!,
        spotType:
            SpotReservationParameterSpotTypeEnum.fromJson(json[r'spotType'])!,
        deck: mapValueOfType<String>(json, r'deck'),
        space: mapValueOfType<String>(json, r'space'),
        spot: mapValueOfType<String>(json, r'spot')!,
        width: num.parse('${json[r'width']}'),
        length: num.parse('${json[r'length']}'),
        height: num.parse('${json[r'height']}'),
        fuel: mapValueOfType<String>(json, r'fuel'),
        weight: mapValueOfType<String>(json, r'weight'),
        mode: Mode.fromJson(json[r'mode']),
      );
    }
    return null;
  }

  static List<SpotReservationParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <SpotReservationParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SpotReservationParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SpotReservationParameter> mapFromJson(dynamic json) {
    final map = <String, SpotReservationParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SpotReservationParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SpotReservationParameter-objects as value to a dart map
  static Map<String, List<SpotReservationParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<SpotReservationParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SpotReservationParameter.listFromJson(
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
    'spot',
  };
}

class SpotReservationParameterSpotTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const SpotReservationParameterSpotTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const VEHICLE_SPOT =
      SpotReservationParameterSpotTypeEnum._(r'VEHICLE_SPOT');
  static const PASSENGER_SPOT =
      SpotReservationParameterSpotTypeEnum._(r'PASSENGER_SPOT');
  static const LUGGAGE_SPOT =
      SpotReservationParameterSpotTypeEnum._(r'LUGGAGE_SPOT');

  /// List of all possible values in this [enum][SpotReservationParameterSpotTypeEnum].
  static const values = <SpotReservationParameterSpotTypeEnum>[
    VEHICLE_SPOT,
    PASSENGER_SPOT,
    LUGGAGE_SPOT,
  ];

  static SpotReservationParameterSpotTypeEnum? fromJson(dynamic value) =>
      SpotReservationParameterSpotTypeEnumTypeTransformer().decode(value);

  static List<SpotReservationParameterSpotTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <SpotReservationParameterSpotTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SpotReservationParameterSpotTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [SpotReservationParameterSpotTypeEnum] to String,
/// and [decode] dynamic data back to [SpotReservationParameterSpotTypeEnum].
class SpotReservationParameterSpotTypeEnumTypeTransformer {
  factory SpotReservationParameterSpotTypeEnumTypeTransformer() => _instance ??=
      const SpotReservationParameterSpotTypeEnumTypeTransformer._();

  const SpotReservationParameterSpotTypeEnumTypeTransformer._();

  String encode(SpotReservationParameterSpotTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a SpotReservationParameterSpotTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  SpotReservationParameterSpotTypeEnum? decode(dynamic data,
      {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'VEHICLE_SPOT':
          return SpotReservationParameterSpotTypeEnum.VEHICLE_SPOT;
        case r'PASSENGER_SPOT':
          return SpotReservationParameterSpotTypeEnum.PASSENGER_SPOT;
        case r'LUGGAGE_SPOT':
          return SpotReservationParameterSpotTypeEnum.LUGGAGE_SPOT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [SpotReservationParameterSpotTypeEnumTypeTransformer] instance.
  static SpotReservationParameterSpotTypeEnumTypeTransformer? _instance;
}
