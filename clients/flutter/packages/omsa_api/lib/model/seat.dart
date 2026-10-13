//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Seat {
  /// Returns a new [Seat] instance.
  Seat({
    this.type,
    this.id,
    this.deck,
    this.space,
    this.row = 0,
    this.seatNumber = 0,
    this.facing,
    this.byWindow,
    this.legSpace = 0,
    this.byAisle,
    this.hasArmRest,
    this.hasTray,
    this.hasAirco,
    this.hasEnergySupply,
    this.hasLight,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? deck;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? space;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int row;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int seatNumber;

  SeatFacingEnum? facing;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? byWindow;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int legSpace;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? byAisle;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? hasArmRest;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? hasTray;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? hasAirco;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? hasEnergySupply;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? hasLight;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Seat &&
          other.type == type &&
          other.id == id &&
          other.deck == deck &&
          other.space == space &&
          other.row == row &&
          other.seatNumber == seatNumber &&
          other.facing == facing &&
          other.byWindow == byWindow &&
          other.legSpace == legSpace &&
          other.byAisle == byAisle &&
          other.hasArmRest == hasArmRest &&
          other.hasTray == hasTray &&
          other.hasAirco == hasAirco &&
          other.hasEnergySupply == hasEnergySupply &&
          other.hasLight == hasLight;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (id == null ? 0 : id!.hashCode) +
      (deck == null ? 0 : deck!.hashCode) +
      (space == null ? 0 : space!.hashCode) +
      (row.hashCode) +
      (seatNumber.hashCode) +
      (facing == null ? 0 : facing!.hashCode) +
      (byWindow == null ? 0 : byWindow!.hashCode) +
      (legSpace.hashCode) +
      (byAisle == null ? 0 : byAisle!.hashCode) +
      (hasArmRest == null ? 0 : hasArmRest!.hashCode) +
      (hasTray == null ? 0 : hasTray!.hashCode) +
      (hasAirco == null ? 0 : hasAirco!.hashCode) +
      (hasEnergySupply == null ? 0 : hasEnergySupply!.hashCode) +
      (hasLight == null ? 0 : hasLight!.hashCode);

  @override
  String toString() =>
      'Seat[type=$type, id=$id, deck=$deck, space=$space, row=$row, seatNumber=$seatNumber, facing=$facing, byWindow=$byWindow, legSpace=$legSpace, byAisle=$byAisle, hasArmRest=$hasArmRest, hasTray=$hasTray, hasAirco=$hasAirco, hasEnergySupply=$hasEnergySupply, hasLight=$hasLight]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
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
    json[r'row'] = this.row;
    json[r'seatNumber'] = this.seatNumber;
    if (this.facing != null) {
      json[r'facing'] = this.facing;
    } else {
      json[r'facing'] = null;
    }
    if (this.byWindow != null) {
      json[r'byWindow'] = this.byWindow;
    } else {
      json[r'byWindow'] = null;
    }
    json[r'legSpace'] = this.legSpace;
    if (this.byAisle != null) {
      json[r'byAisle'] = this.byAisle;
    } else {
      json[r'byAisle'] = null;
    }
    if (this.hasArmRest != null) {
      json[r'hasArmRest'] = this.hasArmRest;
    } else {
      json[r'hasArmRest'] = null;
    }
    if (this.hasTray != null) {
      json[r'hasTray'] = this.hasTray;
    } else {
      json[r'hasTray'] = null;
    }
    if (this.hasAirco != null) {
      json[r'hasAirco'] = this.hasAirco;
    } else {
      json[r'hasAirco'] = null;
    }
    if (this.hasEnergySupply != null) {
      json[r'hasEnergySupply'] = this.hasEnergySupply;
    } else {
      json[r'hasEnergySupply'] = null;
    }
    if (this.hasLight != null) {
      json[r'hasLight'] = this.hasLight;
    } else {
      json[r'hasLight'] = null;
    }
    return json;
  }

  /// Returns a new [Seat] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Seat? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Seat[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Seat[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Seat(
        type: mapValueOfType<String>(json, r'type'),
        id: mapValueOfType<String>(json, r'id'),
        deck: mapValueOfType<String>(json, r'deck'),
        space: mapValueOfType<String>(json, r'space'),
        row: mapValueOfType<int>(json, r'row') ?? 0,
        seatNumber: mapValueOfType<int>(json, r'seatNumber') ?? 0,
        facing: SeatFacingEnum.fromJson(json[r'facing']),
        byWindow: mapValueOfType<bool>(json, r'byWindow'),
        legSpace: mapValueOfType<int>(json, r'legSpace') ?? 0,
        byAisle: mapValueOfType<bool>(json, r'byAisle'),
        hasArmRest: mapValueOfType<bool>(json, r'hasArmRest'),
        hasTray: mapValueOfType<bool>(json, r'hasTray'),
        hasAirco: mapValueOfType<bool>(json, r'hasAirco'),
        hasEnergySupply: mapValueOfType<bool>(json, r'hasEnergySupply'),
        hasLight: mapValueOfType<bool>(json, r'hasLight'),
      );
    }
    return null;
  }

  static List<Seat> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Seat>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Seat.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Seat> mapFromJson(dynamic json) {
    final map = <String, Seat>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Seat.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Seat-objects as value to a dart map
  static Map<String, List<Seat>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Seat>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Seat.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{};
}

class SeatFacingEnum {
  /// Instantiate a new enum with the provided [value].
  const SeatFacingEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const FRONT = SeatFacingEnum._(r'FRONT');
  static const REAR = SeatFacingEnum._(r'REAR');
  static const LEFT = SeatFacingEnum._(r'LEFT');
  static const RIGHT = SeatFacingEnum._(r'RIGHT');
  static const OTHER = SeatFacingEnum._(r'OTHER');

  /// List of all possible values in this [enum][SeatFacingEnum].
  static const values = <SeatFacingEnum>[
    FRONT,
    REAR,
    LEFT,
    RIGHT,
    OTHER,
  ];

  static SeatFacingEnum? fromJson(dynamic value) =>
      SeatFacingEnumTypeTransformer().decode(value);

  static List<SeatFacingEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <SeatFacingEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SeatFacingEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [SeatFacingEnum] to String,
/// and [decode] dynamic data back to [SeatFacingEnum].
class SeatFacingEnumTypeTransformer {
  factory SeatFacingEnumTypeTransformer() =>
      _instance ??= const SeatFacingEnumTypeTransformer._();

  const SeatFacingEnumTypeTransformer._();

  String encode(SeatFacingEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a SeatFacingEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  SeatFacingEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'FRONT':
          return SeatFacingEnum.FRONT;
        case r'REAR':
          return SeatFacingEnum.REAR;
        case r'LEFT':
          return SeatFacingEnum.LEFT;
        case r'RIGHT':
          return SeatFacingEnum.RIGHT;
        case r'OTHER':
          return SeatFacingEnum.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [SeatFacingEnumTypeTransformer] instance.
  static SeatFacingEnumTypeTransformer? _instance;
}
