//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AddTravellerInput {
  /// Returns a new [AddTravellerInput] instance.
  AddTravellerInput({
    required this.type,
    required this.packageId,
    this.individualTraveller,
    this.userProfile,
    this.travellingAsset,
  });

  String type;

  /// default string, full names etc (length 0-200)
  String packageId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  IndividualTraveller? individualTraveller;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  UserProfile? userProfile;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravellingAsset? travellingAsset;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AddTravellerInput &&
          other.type == type &&
          other.packageId == packageId &&
          other.individualTraveller == individualTraveller &&
          other.userProfile == userProfile &&
          other.travellingAsset == travellingAsset;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (packageId.hashCode) +
      (individualTraveller == null ? 0 : individualTraveller!.hashCode) +
      (userProfile == null ? 0 : userProfile!.hashCode) +
      (travellingAsset == null ? 0 : travellingAsset!.hashCode);

  @override
  String toString() =>
      'AddTravellerInput[type=$type, packageId=$packageId, individualTraveller=$individualTraveller, userProfile=$userProfile, travellingAsset=$travellingAsset]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'packageId'] = this.packageId;
    if (this.individualTraveller != null) {
      json[r'individualTraveller'] = this.individualTraveller;
    } else {
      json[r'individualTraveller'] = null;
    }
    if (this.userProfile != null) {
      json[r'userProfile'] = this.userProfile;
    } else {
      json[r'userProfile'] = null;
    }
    if (this.travellingAsset != null) {
      json[r'travellingAsset'] = this.travellingAsset;
    } else {
      json[r'travellingAsset'] = null;
    }
    return json;
  }

  /// Returns a new [AddTravellerInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AddTravellerInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "AddTravellerInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "AddTravellerInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AddTravellerInput(
        type: mapValueOfType<String>(json, r'type')!,
        packageId: mapValueOfType<String>(json, r'packageId')!,
        individualTraveller:
            IndividualTraveller.fromJson(json[r'individualTraveller']),
        userProfile: UserProfile.fromJson(json[r'userProfile']),
        travellingAsset: TravellingAsset.fromJson(json[r'travellingAsset']),
      );
    }
    return null;
  }

  static List<AddTravellerInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AddTravellerInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddTravellerInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AddTravellerInput> mapFromJson(dynamic json) {
    final map = <String, AddTravellerInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AddTravellerInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AddTravellerInput-objects as value to a dart map
  static Map<String, List<AddTravellerInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AddTravellerInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AddTravellerInput.listFromJson(
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
    'packageId',
  };
}
