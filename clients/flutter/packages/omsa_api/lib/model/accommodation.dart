//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Accommodation {
  /// Returns a new [Accommodation] instance.
  Accommodation({
    this.type,
    this.description,
    this.classOfUse,
    this.name,
    this.gender,
    this.berthType,
    this.nuisanceFacility = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  /// long string, memos etc (length 0-10.000)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ClassOfUse? classOfUse;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? name;

  AccommodationGenderEnum? gender;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  BerthType? berthType;

  List<String> nuisanceFacility;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Accommodation &&
          other.type == type &&
          other.description == description &&
          other.classOfUse == classOfUse &&
          other.name == name &&
          other.gender == gender &&
          other.berthType == berthType &&
          _deepEquality.equals(other.nuisanceFacility, nuisanceFacility);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (classOfUse == null ? 0 : classOfUse!.hashCode) +
      (name == null ? 0 : name!.hashCode) +
      (gender == null ? 0 : gender!.hashCode) +
      (berthType == null ? 0 : berthType!.hashCode) +
      (nuisanceFacility.hashCode);

  @override
  String toString() =>
      'Accommodation[type=$type, description=$description, classOfUse=$classOfUse, name=$name, gender=$gender, berthType=$berthType, nuisanceFacility=$nuisanceFacility]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.classOfUse != null) {
      json[r'classOfUse'] = this.classOfUse;
    } else {
      json[r'classOfUse'] = null;
    }
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.gender != null) {
      json[r'gender'] = this.gender;
    } else {
      json[r'gender'] = null;
    }
    if (this.berthType != null) {
      json[r'berthType'] = this.berthType;
    } else {
      json[r'berthType'] = null;
    }
    json[r'nuisanceFacility'] = this.nuisanceFacility;
    return json;
  }

  /// Returns a new [Accommodation] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Accommodation? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Accommodation[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Accommodation[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Accommodation(
        type: mapValueOfType<String>(json, r'type'),
        description: mapValueOfType<String>(json, r'description'),
        classOfUse: ClassOfUse.fromJson(json[r'classOfUse']),
        name: mapValueOfType<String>(json, r'name'),
        gender: AccommodationGenderEnum.fromJson(json[r'gender']),
        berthType: BerthType.fromJson(json[r'berthType']),
        nuisanceFacility: json[r'nuisanceFacility'] is Iterable
            ? (json[r'nuisanceFacility'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<Accommodation> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Accommodation>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Accommodation.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Accommodation> mapFromJson(dynamic json) {
    final map = <String, Accommodation>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Accommodation.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Accommodation-objects as value to a dart map
  static Map<String, List<Accommodation>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Accommodation>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Accommodation.listFromJson(
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

class AccommodationGenderEnum {
  /// Instantiate a new enum with the provided [value].
  const AccommodationGenderEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const M = AccommodationGenderEnum._(r'M');
  static const F = AccommodationGenderEnum._(r'F');
  static const X = AccommodationGenderEnum._(r'X');
  static const U = AccommodationGenderEnum._(r'U');

  /// List of all possible values in this [enum][AccommodationGenderEnum].
  static const values = <AccommodationGenderEnum>[
    M,
    F,
    X,
    U,
  ];

  static AccommodationGenderEnum? fromJson(dynamic value) =>
      AccommodationGenderEnumTypeTransformer().decode(value);

  static List<AccommodationGenderEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AccommodationGenderEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AccommodationGenderEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [AccommodationGenderEnum] to String,
/// and [decode] dynamic data back to [AccommodationGenderEnum].
class AccommodationGenderEnumTypeTransformer {
  factory AccommodationGenderEnumTypeTransformer() =>
      _instance ??= const AccommodationGenderEnumTypeTransformer._();

  const AccommodationGenderEnumTypeTransformer._();

  String encode(AccommodationGenderEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a AccommodationGenderEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  AccommodationGenderEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'M':
          return AccommodationGenderEnum.M;
        case r'F':
          return AccommodationGenderEnum.F;
        case r'X':
          return AccommodationGenderEnum.X;
        case r'U':
          return AccommodationGenderEnum.U;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [AccommodationGenderEnumTypeTransformer] instance.
  static AccommodationGenderEnumTypeTransformer? _instance;
}
