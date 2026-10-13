//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AncillaryInput {
  /// Returns a new [AncillaryInput] instance.
  AncillaryInput({
    required this.packageId,
    required this.type,
    this.offerId,
    required this.legId,
    this.location,
    required this.ancillaryId,
    this.replaceAncillaryId,
  });

  /// default string, full names etc (length 0-200)
  String packageId;

  String type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? offerId;

  /// default string, full names etc (length 0-200)
  String legId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? location;

  AncillaryReference ancillaryId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AncillaryReference? replaceAncillaryId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AncillaryInput &&
          other.packageId == packageId &&
          other.type == type &&
          other.offerId == offerId &&
          other.legId == legId &&
          other.location == location &&
          other.ancillaryId == ancillaryId &&
          other.replaceAncillaryId == replaceAncillaryId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (packageId.hashCode) +
      (type.hashCode) +
      (offerId == null ? 0 : offerId!.hashCode) +
      (legId.hashCode) +
      (location == null ? 0 : location!.hashCode) +
      (ancillaryId.hashCode) +
      (replaceAncillaryId == null ? 0 : replaceAncillaryId!.hashCode);

  @override
  String toString() =>
      'AncillaryInput[packageId=$packageId, type=$type, offerId=$offerId, legId=$legId, location=$location, ancillaryId=$ancillaryId, replaceAncillaryId=$replaceAncillaryId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'packageId'] = this.packageId;
    json[r'type'] = this.type;
    if (this.offerId != null) {
      json[r'offerId'] = this.offerId;
    } else {
      json[r'offerId'] = null;
    }
    json[r'legId'] = this.legId;
    if (this.location != null) {
      json[r'location'] = this.location;
    } else {
      json[r'location'] = null;
    }
    json[r'ancillaryId'] = this.ancillaryId;
    if (this.replaceAncillaryId != null) {
      json[r'replaceAncillaryId'] = this.replaceAncillaryId;
    } else {
      json[r'replaceAncillaryId'] = null;
    }
    return json;
  }

  /// Returns a new [AncillaryInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AncillaryInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "AncillaryInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "AncillaryInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AncillaryInput(
        packageId: mapValueOfType<String>(json, r'packageId')!,
        type: mapValueOfType<String>(json, r'type')!,
        offerId: mapValueOfType<String>(json, r'offerId'),
        legId: mapValueOfType<String>(json, r'legId')!,
        location: PlaceReference.fromJson(json[r'location']),
        ancillaryId: AncillaryReference.fromJson(json[r'ancillaryId'])!,
        replaceAncillaryId:
            AncillaryReference.fromJson(json[r'replaceAncillaryId']),
      );
    }
    return null;
  }

  static List<AncillaryInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AncillaryInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AncillaryInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AncillaryInput> mapFromJson(dynamic json) {
    final map = <String, AncillaryInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AncillaryInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AncillaryInput-objects as value to a dart map
  static Map<String, List<AncillaryInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AncillaryInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AncillaryInput.listFromJson(
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
    'legId',
    'ancillaryId',
  };
}
