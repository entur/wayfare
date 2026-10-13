//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AssetInput {
  /// Returns a new [AssetInput] instance.
  AssetInput({
    required this.packageId,
    required this.type,
    this.offerId,
    required this.legId,
    this.location,
    required this.assetId,
    this.replaceAssetId,
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

  /// default string, full names etc (length 0-200)
  String assetId;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? replaceAssetId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AssetInput &&
          other.packageId == packageId &&
          other.type == type &&
          other.offerId == offerId &&
          other.legId == legId &&
          other.location == location &&
          other.assetId == assetId &&
          other.replaceAssetId == replaceAssetId;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (packageId.hashCode) +
      (type.hashCode) +
      (offerId == null ? 0 : offerId!.hashCode) +
      (legId.hashCode) +
      (location == null ? 0 : location!.hashCode) +
      (assetId.hashCode) +
      (replaceAssetId == null ? 0 : replaceAssetId!.hashCode);

  @override
  String toString() =>
      'AssetInput[packageId=$packageId, type=$type, offerId=$offerId, legId=$legId, location=$location, assetId=$assetId, replaceAssetId=$replaceAssetId]';

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
    json[r'assetId'] = this.assetId;
    if (this.replaceAssetId != null) {
      json[r'replaceAssetId'] = this.replaceAssetId;
    } else {
      json[r'replaceAssetId'] = null;
    }
    return json;
  }

  /// Returns a new [AssetInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AssetInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "AssetInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "AssetInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AssetInput(
        packageId: mapValueOfType<String>(json, r'packageId')!,
        type: mapValueOfType<String>(json, r'type')!,
        offerId: mapValueOfType<String>(json, r'offerId'),
        legId: mapValueOfType<String>(json, r'legId')!,
        location: PlaceReference.fromJson(json[r'location']),
        assetId: mapValueOfType<String>(json, r'assetId')!,
        replaceAssetId: mapValueOfType<String>(json, r'replaceAssetId'),
      );
    }
    return null;
  }

  static List<AssetInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AssetInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssetInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssetInput> mapFromJson(dynamic json) {
    final map = <String, AssetInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssetInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AssetInput-objects as value to a dart map
  static Map<String, List<AssetInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AssetInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AssetInput.listFromJson(
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
    'assetId',
  };
}
