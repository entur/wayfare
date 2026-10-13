//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UserProfile {
  /// Returns a new [UserProfile] instance.
  UserProfile({
    required this.type,
    this.entitlements,
    this.requirements,
    required this.id,
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

  UserProfileAgeGroupEnum? ageGroup;

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
      other is UserProfile &&
          other.type == type &&
          other.entitlements == entitlements &&
          other.requirements == requirements &&
          other.id == id &&
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
      'UserProfile[type=$type, entitlements=$entitlements, requirements=$requirements, id=$id, count=$count, minimumAge=$minimumAge, maximumAge=$maximumAge, monthDayOnWhichAgeApplies=$monthDayOnWhichAgeApplies, ageGroup=$ageGroup, minimumHeight=$minimumHeight, maximumHeight=$maximumHeight, localResident=$localResident, genderLimitation=$genderLimitation]';

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

  /// Returns a new [UserProfile] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UserProfile? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "UserProfile[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "UserProfile[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UserProfile(
        type: mapValueOfType<String>(json, r'type')!,
        entitlements: TravelPartyEntitlements.fromJson(json[r'entitlements']),
        requirements: TravelPartyRequirements.fromJson(json[r'requirements']),
        id: mapValueOfType<String>(json, r'id')!,
        count: mapValueOfType<int>(json, r'count') ?? 0,
        minimumAge: mapValueOfType<int>(json, r'minimumAge') ?? 0,
        maximumAge: mapValueOfType<int>(json, r'maximumAge') ?? 0,
        monthDayOnWhichAgeApplies:
            mapValueOfType<int>(json, r'monthDayOnWhichAgeApplies') ?? 0,
        ageGroup: UserProfileAgeGroupEnum.fromJson(json[r'ageGroup']),
        minimumHeight: mapValueOfType<int>(json, r'minimumHeight') ?? 0,
        maximumHeight: mapValueOfType<int>(json, r'maximumHeight') ?? 0,
        localResident: mapValueOfType<bool>(json, r'localResident'),
        genderLimitation: mapValueOfType<bool>(json, r'genderLimitation'),
      );
    }
    return null;
  }

  static List<UserProfile> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UserProfile>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserProfile.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UserProfile> mapFromJson(dynamic json) {
    final map = <String, UserProfile>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UserProfile.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UserProfile-objects as value to a dart map
  static Map<String, List<UserProfile>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<UserProfile>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UserProfile.listFromJson(
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

class UserProfileAgeGroupEnum {
  /// Instantiate a new enum with the provided [value].
  const UserProfileAgeGroupEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ANYONE = UserProfileAgeGroupEnum._(r'ANYONE');
  static const INFANT = UserProfileAgeGroupEnum._(r'INFANT');
  static const CHILD = UserProfileAgeGroupEnum._(r'CHILD');
  static const YOUTH = UserProfileAgeGroupEnum._(r'YOUTH');
  static const ADULT = UserProfileAgeGroupEnum._(r'ADULT');
  static const SENIOR = UserProfileAgeGroupEnum._(r'SENIOR');

  /// List of all possible values in this [enum][UserProfileAgeGroupEnum].
  static const values = <UserProfileAgeGroupEnum>[
    ANYONE,
    INFANT,
    CHILD,
    YOUTH,
    ADULT,
    SENIOR,
  ];

  static UserProfileAgeGroupEnum? fromJson(dynamic value) =>
      UserProfileAgeGroupEnumTypeTransformer().decode(value);

  static List<UserProfileAgeGroupEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UserProfileAgeGroupEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UserProfileAgeGroupEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UserProfileAgeGroupEnum] to String,
/// and [decode] dynamic data back to [UserProfileAgeGroupEnum].
class UserProfileAgeGroupEnumTypeTransformer {
  factory UserProfileAgeGroupEnumTypeTransformer() =>
      _instance ??= const UserProfileAgeGroupEnumTypeTransformer._();

  const UserProfileAgeGroupEnumTypeTransformer._();

  String encode(UserProfileAgeGroupEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a UserProfileAgeGroupEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UserProfileAgeGroupEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ANYONE':
          return UserProfileAgeGroupEnum.ANYONE;
        case r'INFANT':
          return UserProfileAgeGroupEnum.INFANT;
        case r'CHILD':
          return UserProfileAgeGroupEnum.CHILD;
        case r'YOUTH':
          return UserProfileAgeGroupEnum.YOUTH;
        case r'ADULT':
          return UserProfileAgeGroupEnum.ADULT;
        case r'SENIOR':
          return UserProfileAgeGroupEnum.SENIOR;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UserProfileAgeGroupEnumTypeTransformer] instance.
  static UserProfileAgeGroupEnumTypeTransformer? _instance;
}
