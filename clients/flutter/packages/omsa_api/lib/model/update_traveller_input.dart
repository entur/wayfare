//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UpdateTravellerInput {
  /// Returns a new [UpdateTravellerInput] instance.
  UpdateTravellerInput({
    required this.type,
    required this.packageId,
    required this.travellerId,
    this.individualTraveller,
    this.userProfile,
    this.travellingAsset,
  });

  String type;

  /// default string, full names etc (length 0-200)
  String packageId;

  /// default string, full names etc (length 0-200)
  String travellerId;

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
      other is UpdateTravellerInput &&
          other.type == type &&
          other.packageId == packageId &&
          other.travellerId == travellerId &&
          other.individualTraveller == individualTraveller &&
          other.userProfile == userProfile &&
          other.travellingAsset == travellingAsset;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (packageId.hashCode) +
      (travellerId.hashCode) +
      (individualTraveller == null ? 0 : individualTraveller!.hashCode) +
      (userProfile == null ? 0 : userProfile!.hashCode) +
      (travellingAsset == null ? 0 : travellingAsset!.hashCode);

  @override
  String toString() =>
      'UpdateTravellerInput[type=$type, packageId=$packageId, travellerId=$travellerId, individualTraveller=$individualTraveller, userProfile=$userProfile, travellingAsset=$travellingAsset]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'packageId'] = this.packageId;
    json[r'travellerId'] = this.travellerId;
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

  /// Returns a new [UpdateTravellerInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateTravellerInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "UpdateTravellerInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "UpdateTravellerInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateTravellerInput(
        type: mapValueOfType<String>(json, r'type')!,
        packageId: mapValueOfType<String>(json, r'packageId')!,
        travellerId: mapValueOfType<String>(json, r'travellerId')!,
        individualTraveller:
            IndividualTraveller.fromJson(json[r'individualTraveller']),
        userProfile: UserProfile.fromJson(json[r'userProfile']),
        travellingAsset: TravellingAsset.fromJson(json[r'travellingAsset']),
      );
    }
    return null;
  }

  static List<UpdateTravellerInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UpdateTravellerInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTravellerInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTravellerInput> mapFromJson(dynamic json) {
    final map = <String, UpdateTravellerInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTravellerInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateTravellerInput-objects as value to a dart map
  static Map<String, List<UpdateTravellerInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<UpdateTravellerInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateTravellerInput.listFromJson(
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
    'travellerId',
  };
}
