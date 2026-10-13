//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PackageAllOfTravellers {
  /// Returns a new [PackageAllOfTravellers] instance.
  PackageAllOfTravellers({
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
    this.count = 0,
    this.minimumAge = 0,
    this.maximumAge = 0,
    this.monthDayOnWhichAgeApplies = 0,
    this.ageGroup,
    this.minimumHeight = 0,
    this.maximumHeight = 0,
    this.localResident,
    this.genderLimitation,
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

  PackageAllOfTravellersGenderEnum? gender;

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

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int count;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int minimumAge;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int maximumAge;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int monthDayOnWhichAgeApplies;

  PackageAllOfTravellersAgeGroupEnum? ageGroup;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int minimumHeight;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int maximumHeight;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? localResident;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? genderLimitation;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PackageAllOfTravellers &&
          other.type == type &&
          other.entitlements == entitlements &&
          other.requirements == requirements &&
          other.id == id &&
          other.isValidated == isValidated &&
          other.age == age &&
          other.gender == gender &&
          other.fullName == fullName &&
          other.customerReference == customerReference &&
          _deepEquality.equals(other.customFields, customFields) &&
          other.count == count &&
          other.minimumAge == minimumAge &&
          other.maximumAge == maximumAge &&
          other.monthDayOnWhichAgeApplies == monthDayOnWhichAgeApplies &&
          other.ageGroup == ageGroup &&
          other.minimumHeight == minimumHeight &&
          other.maximumHeight == maximumHeight &&
          other.localResident == localResident &&
          other.genderLimitation == genderLimitation;

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
      (customFields.hashCode) +
      (count.hashCode) +
      (minimumAge.hashCode) +
      (maximumAge.hashCode) +
      (monthDayOnWhichAgeApplies.hashCode) +
      (ageGroup == null ? 0 : ageGroup!.hashCode) +
      (minimumHeight.hashCode) +
      (maximumHeight.hashCode) +
      (localResident == null ? 0 : localResident!.hashCode) +
      (genderLimitation == null ? 0 : genderLimitation!.hashCode);

  @override
  String toString() =>
      'PackageAllOfTravellers[type=$type, entitlements=$entitlements, requirements=$requirements, id=$id, isValidated=$isValidated, age=$age, gender=$gender, fullName=$fullName, customerReference=$customerReference, customFields=$customFields, count=$count, minimumAge=$minimumAge, maximumAge=$maximumAge, monthDayOnWhichAgeApplies=$monthDayOnWhichAgeApplies, ageGroup=$ageGroup, minimumHeight=$minimumHeight, maximumHeight=$maximumHeight, localResident=$localResident, genderLimitation=$genderLimitation]';

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
    json[r'count'] = this.count;
    json[r'minimumAge'] = this.minimumAge;
    json[r'maximumAge'] = this.maximumAge;
    json[r'monthDayOnWhichAgeApplies'] = this.monthDayOnWhichAgeApplies;
    if (this.ageGroup != null) {
      json[r'ageGroup'] = this.ageGroup;
    } else {
      json[r'ageGroup'] = null;
    }
    json[r'minimumHeight'] = this.minimumHeight;
    json[r'maximumHeight'] = this.maximumHeight;
    if (this.localResident != null) {
      json[r'localResident'] = this.localResident;
    } else {
      json[r'localResident'] = null;
    }
    if (this.genderLimitation != null) {
      json[r'genderLimitation'] = this.genderLimitation;
    } else {
      json[r'genderLimitation'] = null;
    }
    return json;
  }

  /// Returns a new [PackageAllOfTravellers] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PackageAllOfTravellers? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "PackageAllOfTravellers[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "PackageAllOfTravellers[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PackageAllOfTravellers(
        type: mapValueOfType<String>(json, r'type')!,
        entitlements: TravelPartyEntitlements.fromJson(json[r'entitlements']),
        requirements: TravelPartyRequirements.fromJson(json[r'requirements']),
        id: mapValueOfType<String>(json, r'id')!,
        isValidated: mapValueOfType<bool>(json, r'isValidated'),
        age: mapValueOfType<int>(json, r'age') ?? 0,
        gender: PackageAllOfTravellersGenderEnum.fromJson(json[r'gender']),
        fullName: mapValueOfType<String>(json, r'fullName'),
        customerReference: mapValueOfType<String>(json, r'customerReference'),
        customFields:
            mapCastOfType<String, Object>(json, r'customFields') ?? const {},
        count: mapValueOfType<int>(json, r'count') ?? 0,
        minimumAge: mapValueOfType<int>(json, r'minimumAge') ?? 0,
        maximumAge: mapValueOfType<int>(json, r'maximumAge') ?? 0,
        monthDayOnWhichAgeApplies:
            mapValueOfType<int>(json, r'monthDayOnWhichAgeApplies') ?? 0,
        ageGroup:
            PackageAllOfTravellersAgeGroupEnum.fromJson(json[r'ageGroup']),
        minimumHeight: mapValueOfType<int>(json, r'minimumHeight') ?? 0,
        maximumHeight: mapValueOfType<int>(json, r'maximumHeight') ?? 0,
        localResident: mapValueOfType<bool>(json, r'localResident'),
        genderLimitation: mapValueOfType<bool>(json, r'genderLimitation'),
      );
    }
    return null;
  }

  static List<PackageAllOfTravellers> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageAllOfTravellers>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageAllOfTravellers.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PackageAllOfTravellers> mapFromJson(dynamic json) {
    final map = <String, PackageAllOfTravellers>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PackageAllOfTravellers.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PackageAllOfTravellers-objects as value to a dart map
  static Map<String, List<PackageAllOfTravellers>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<PackageAllOfTravellers>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PackageAllOfTravellers.listFromJson(
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

class PackageAllOfTravellersGenderEnum {
  /// Instantiate a new enum with the provided [value].
  const PackageAllOfTravellersGenderEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const M = PackageAllOfTravellersGenderEnum._(r'M');
  static const F = PackageAllOfTravellersGenderEnum._(r'F');
  static const X = PackageAllOfTravellersGenderEnum._(r'X');
  static const U = PackageAllOfTravellersGenderEnum._(r'U');

  /// List of all possible values in this [enum][PackageAllOfTravellersGenderEnum].
  static const values = <PackageAllOfTravellersGenderEnum>[
    M,
    F,
    X,
    U,
  ];

  static PackageAllOfTravellersGenderEnum? fromJson(dynamic value) =>
      PackageAllOfTravellersGenderEnumTypeTransformer().decode(value);

  static List<PackageAllOfTravellersGenderEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageAllOfTravellersGenderEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageAllOfTravellersGenderEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PackageAllOfTravellersGenderEnum] to String,
/// and [decode] dynamic data back to [PackageAllOfTravellersGenderEnum].
class PackageAllOfTravellersGenderEnumTypeTransformer {
  factory PackageAllOfTravellersGenderEnumTypeTransformer() =>
      _instance ??= const PackageAllOfTravellersGenderEnumTypeTransformer._();

  const PackageAllOfTravellersGenderEnumTypeTransformer._();

  String encode(PackageAllOfTravellersGenderEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PackageAllOfTravellersGenderEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PackageAllOfTravellersGenderEnum? decode(dynamic data,
      {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'M':
          return PackageAllOfTravellersGenderEnum.M;
        case r'F':
          return PackageAllOfTravellersGenderEnum.F;
        case r'X':
          return PackageAllOfTravellersGenderEnum.X;
        case r'U':
          return PackageAllOfTravellersGenderEnum.U;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PackageAllOfTravellersGenderEnumTypeTransformer] instance.
  static PackageAllOfTravellersGenderEnumTypeTransformer? _instance;
}

class PackageAllOfTravellersAgeGroupEnum {
  /// Instantiate a new enum with the provided [value].
  const PackageAllOfTravellersAgeGroupEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ANYONE = PackageAllOfTravellersAgeGroupEnum._(r'ANYONE');
  static const INFANT = PackageAllOfTravellersAgeGroupEnum._(r'INFANT');
  static const CHILD = PackageAllOfTravellersAgeGroupEnum._(r'CHILD');
  static const YOUTH = PackageAllOfTravellersAgeGroupEnum._(r'YOUTH');
  static const ADULT = PackageAllOfTravellersAgeGroupEnum._(r'ADULT');
  static const SENIOR = PackageAllOfTravellersAgeGroupEnum._(r'SENIOR');

  /// List of all possible values in this [enum][PackageAllOfTravellersAgeGroupEnum].
  static const values = <PackageAllOfTravellersAgeGroupEnum>[
    ANYONE,
    INFANT,
    CHILD,
    YOUTH,
    ADULT,
    SENIOR,
  ];

  static PackageAllOfTravellersAgeGroupEnum? fromJson(dynamic value) =>
      PackageAllOfTravellersAgeGroupEnumTypeTransformer().decode(value);

  static List<PackageAllOfTravellersAgeGroupEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageAllOfTravellersAgeGroupEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageAllOfTravellersAgeGroupEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PackageAllOfTravellersAgeGroupEnum] to String,
/// and [decode] dynamic data back to [PackageAllOfTravellersAgeGroupEnum].
class PackageAllOfTravellersAgeGroupEnumTypeTransformer {
  factory PackageAllOfTravellersAgeGroupEnumTypeTransformer() =>
      _instance ??= const PackageAllOfTravellersAgeGroupEnumTypeTransformer._();

  const PackageAllOfTravellersAgeGroupEnumTypeTransformer._();

  String encode(PackageAllOfTravellersAgeGroupEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PackageAllOfTravellersAgeGroupEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PackageAllOfTravellersAgeGroupEnum? decode(dynamic data,
      {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ANYONE':
          return PackageAllOfTravellersAgeGroupEnum.ANYONE;
        case r'INFANT':
          return PackageAllOfTravellersAgeGroupEnum.INFANT;
        case r'CHILD':
          return PackageAllOfTravellersAgeGroupEnum.CHILD;
        case r'YOUTH':
          return PackageAllOfTravellersAgeGroupEnum.YOUTH;
        case r'ADULT':
          return PackageAllOfTravellersAgeGroupEnum.ADULT;
        case r'SENIOR':
          return PackageAllOfTravellersAgeGroupEnum.SENIOR;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PackageAllOfTravellersAgeGroupEnumTypeTransformer] instance.
  static PackageAllOfTravellersAgeGroupEnumTypeTransformer? _instance;
}
