//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UpdateTravelDocumentValidityInput {
  /// Returns a new [UpdateTravelDocumentValidityInput] instance.
  UpdateTravelDocumentValidityInput({
    required this.packageId,
    required this.type,
    required this.travelDocumentId,
    required this.newStartTime,
  });

  /// default string, full names etc (length 0-200)
  String packageId;

  String type;

  /// The id of the travel document to update
  String travelDocumentId;

  /// Either RFC3339 date-time (for example 2019-10-12T07:20:50Z) or the keyword NOW for server-side immediate start.
  String newStartTime;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateTravelDocumentValidityInput &&
          other.packageId == packageId &&
          other.type == type &&
          other.travelDocumentId == travelDocumentId &&
          other.newStartTime == newStartTime;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (packageId.hashCode) +
      (type.hashCode) +
      (travelDocumentId.hashCode) +
      (newStartTime.hashCode);

  @override
  String toString() =>
      'UpdateTravelDocumentValidityInput[packageId=$packageId, type=$type, travelDocumentId=$travelDocumentId, newStartTime=$newStartTime]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'packageId'] = this.packageId;
    json[r'type'] = this.type;
    json[r'travelDocumentId'] = this.travelDocumentId;
    json[r'newStartTime'] = this.newStartTime;
    return json;
  }

  /// Returns a new [UpdateTravelDocumentValidityInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateTravelDocumentValidityInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "UpdateTravelDocumentValidityInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "UpdateTravelDocumentValidityInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateTravelDocumentValidityInput(
        packageId: mapValueOfType<String>(json, r'packageId')!,
        type: mapValueOfType<String>(json, r'type')!,
        travelDocumentId: mapValueOfType<String>(json, r'travelDocumentId')!,
        newStartTime: mapValueOfType<String>(json, r'newStartTime')!,
      );
    }
    return null;
  }

  static List<UpdateTravelDocumentValidityInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UpdateTravelDocumentValidityInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTravelDocumentValidityInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTravelDocumentValidityInput> mapFromJson(
      dynamic json) {
    final map = <String, UpdateTravelDocumentValidityInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = UpdateTravelDocumentValidityInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateTravelDocumentValidityInput-objects as value to a dart map
  static Map<String, List<UpdateTravelDocumentValidityInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<UpdateTravelDocumentValidityInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateTravelDocumentValidityInput.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'packageId',
    'type',
    'travelDocumentId',
    'newStartTime',
  };
}
