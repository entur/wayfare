//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class UpdateTravelDocumentValidityResponse {
  /// Returns a new [UpdateTravelDocumentValidityResponse] instance.
  UpdateTravelDocumentValidityResponse({
    required this.previousTravelDocumentId,
    required this.newTravelDocumentId,
  });

  /// The travel document id that was replaced
  String previousTravelDocumentId;

  /// The new travel document id with updated validity
  String newTravelDocumentId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateTravelDocumentValidityResponse &&
          other.previousTravelDocumentId == previousTravelDocumentId &&
          other.newTravelDocumentId == newTravelDocumentId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (previousTravelDocumentId.hashCode) + (newTravelDocumentId.hashCode);

  @override
  String toString() =>
      'UpdateTravelDocumentValidityResponse[previousTravelDocumentId=$previousTravelDocumentId, newTravelDocumentId=$newTravelDocumentId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'previousTravelDocumentId'] = this.previousTravelDocumentId;
    json[r'newTravelDocumentId'] = this.newTravelDocumentId;
    return json;
  }

  /// Returns a new [UpdateTravelDocumentValidityResponse] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static UpdateTravelDocumentValidityResponse? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "UpdateTravelDocumentValidityResponse[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "UpdateTravelDocumentValidityResponse[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return UpdateTravelDocumentValidityResponse(
        previousTravelDocumentId:
            mapValueOfType<String>(json, r'previousTravelDocumentId')!,
        newTravelDocumentId:
            mapValueOfType<String>(json, r'newTravelDocumentId')!,
      );
    }
    return null;
  }

  static List<UpdateTravelDocumentValidityResponse> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UpdateTravelDocumentValidityResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UpdateTravelDocumentValidityResponse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, UpdateTravelDocumentValidityResponse> mapFromJson(
      dynamic json) {
    final map = <String, UpdateTravelDocumentValidityResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value =
            UpdateTravelDocumentValidityResponse.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of UpdateTravelDocumentValidityResponse-objects as value to a dart map
  static Map<String, List<UpdateTravelDocumentValidityResponse>>
      mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<UpdateTravelDocumentValidityResponse>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = UpdateTravelDocumentValidityResponse.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'previousTravelDocumentId',
    'newTravelDocumentId',
  };
}
