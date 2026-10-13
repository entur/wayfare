//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class IndividualTraveller {
  /// Returns a new [IndividualTraveller] instance.
  IndividualTraveller({
    required this.type,
    this.entitlements,
    this.requirements,
    required this.id,
    this.isValidated,
    this.age = 0,
    this.gender,
    this.fullName,
    this.customerReference,
    this.customFields = const {},
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelPartyEntitlements? entitlements;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelPartyRequirements? requirements;

  /// default string, full names etc (length 0-200)
  String id;

  /// Whether this traveler's identity and properties have been verified by the MaaS provider
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isValidated;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int age;

  IndividualTravellerGenderEnum? gender;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? fullName;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? customerReference;

  /// dictionary for extra fields (bilatural agreements)
  Map<String, Object> customFields;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is IndividualTraveller &&
          other.type == type &&
          other.entitlements == entitlements &&
          other.requirements == requirements &&
          other.id == id &&
          other.isValidated == isValidated &&
          other.age == age &&
          other.gender == gender &&
          other.fullName == fullName &&
          other.customerReference == customerReference &&
          _deepEquality.equals(other.customFields, customFields);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (entitlements == null ? 0 : entitlements!.hashCode) +
      (requirements == null ? 0 : requirements!.hashCode) +
      (id.hashCode) +
      (isValidated == null ? 0 : isValidated!.hashCode) +
      (age.hashCode) +
      (gender == null ? 0 : gender!.hashCode) +
      (fullName == null ? 0 : fullName!.hashCode) +
      (customerReference == null ? 0 : customerReference!.hashCode) +
      (customFields.hashCode);

  @override
  String toString() =>
      'IndividualTraveller[type=$type, entitlements=$entitlements, requirements=$requirements, id=$id, isValidated=$isValidated, age=$age, gender=$gender, fullName=$fullName, customerReference=$customerReference, customFields=$customFields]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.entitlements != null) {
      json[r'entitlements'] = this.entitlements;
    } else {
      json[r'entitlements'] = null;
    }
    if (this.requirements != null) {
      json[r'requirements'] = this.requirements;
    } else {
      json[r'requirements'] = null;
    }
    json[r'id'] = this.id;
    if (this.isValidated != null) {
      json[r'isValidated'] = this.isValidated;
    } else {
      json[r'isValidated'] = null;
    }
    json[r'age'] = this.age;
    if (this.gender != null) {
      json[r'gender'] = this.gender;
    } else {
      json[r'gender'] = null;
    }
    if (this.fullName != null) {
      json[r'fullName'] = this.fullName;
    } else {
      json[r'fullName'] = null;
    }
    if (this.customerReference != null) {
      json[r'customerReference'] = this.customerReference;
    } else {
      json[r'customerReference'] = null;
    }
    json[r'customFields'] = this.customFields;
    return json;
  }

  /// Returns a new [IndividualTraveller] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static IndividualTraveller? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "IndividualTraveller[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "IndividualTraveller[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return IndividualTraveller(
        type: mapValueOfType<String>(json, r'type')!,
        entitlements: TravelPartyEntitlements.fromJson(json[r'entitlements']),
        requirements: TravelPartyRequirements.fromJson(json[r'requirements']),
        id: mapValueOfType<String>(json, r'id')!,
        isValidated: mapValueOfType<bool>(json, r'isValidated'),
        age: mapValueOfType<int>(json, r'age') ?? 0,
        gender: IndividualTravellerGenderEnum.fromJson(json[r'gender']),
        fullName: mapValueOfType<String>(json, r'fullName'),
        customerReference: mapValueOfType<String>(json, r'customerReference'),
        customFields:
            mapCastOfType<String, Object>(json, r'customFields') ?? const {},
      );
    }
    return null;
  }

  static List<IndividualTraveller> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <IndividualTraveller>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = IndividualTraveller.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, IndividualTraveller> mapFromJson(dynamic json) {
    final map = <String, IndividualTraveller>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = IndividualTraveller.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of IndividualTraveller-objects as value to a dart map
  static Map<String, List<IndividualTraveller>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<IndividualTraveller>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = IndividualTraveller.listFromJson(
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
    'id',
  };
}

class IndividualTravellerGenderEnum {
  /// Instantiate a new enum with the provided [value].
  const IndividualTravellerGenderEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const M = IndividualTravellerGenderEnum._(r'M');
  static const F = IndividualTravellerGenderEnum._(r'F');
  static const X = IndividualTravellerGenderEnum._(r'X');
  static const U = IndividualTravellerGenderEnum._(r'U');

  /// List of all possible values in this [enum][IndividualTravellerGenderEnum].
  static const values = <IndividualTravellerGenderEnum>[
    M,
    F,
    X,
    U,
  ];

  static IndividualTravellerGenderEnum? fromJson(dynamic value) =>
      IndividualTravellerGenderEnumTypeTransformer().decode(value);

  static List<IndividualTravellerGenderEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <IndividualTravellerGenderEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = IndividualTravellerGenderEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [IndividualTravellerGenderEnum] to String,
/// and [decode] dynamic data back to [IndividualTravellerGenderEnum].
class IndividualTravellerGenderEnumTypeTransformer {
  factory IndividualTravellerGenderEnumTypeTransformer() =>
      _instance ??= const IndividualTravellerGenderEnumTypeTransformer._();

  const IndividualTravellerGenderEnumTypeTransformer._();

  String encode(IndividualTravellerGenderEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a IndividualTravellerGenderEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  IndividualTravellerGenderEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'M':
          return IndividualTravellerGenderEnum.M;
        case r'F':
          return IndividualTravellerGenderEnum.F;
        case r'X':
          return IndividualTravellerGenderEnum.X;
        case r'U':
          return IndividualTravellerGenderEnum.U;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [IndividualTravellerGenderEnumTypeTransformer] instance.
  static IndividualTravellerGenderEnumTypeTransformer? _instance;
}
