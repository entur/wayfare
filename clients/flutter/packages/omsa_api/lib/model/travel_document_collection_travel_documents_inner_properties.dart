//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TravelDocumentCollectionTravelDocumentsInnerProperties {
  /// Returns a new [TravelDocumentCollectionTravelDocumentsInnerProperties] instance.
  TravelDocumentCollectionTravelDocumentsInnerProperties({
    required this.startvalidity,
    required this.endvalidity,
    required this.format,
    this.status,
    required this.type,
    required this.contentType,
    required this.base64,
    this.version,
  });

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  DateTime startvalidity;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  DateTime endvalidity;

  TravelDocumentFormat format;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelDocumentStatus? status;

  String type;

  /// the media type (IANA)
  String contentType;

  /// long string, memos etc (length 0-10.000)
  String base64;

  /// real short string, codes (length 0-10)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? version;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelDocumentCollectionTravelDocumentsInnerProperties &&
          other.startvalidity == startvalidity &&
          other.endvalidity == endvalidity &&
          other.format == format &&
          other.status == status &&
          other.type == type &&
          other.contentType == contentType &&
          other.base64 == base64 &&
          other.version == version;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (startvalidity.hashCode) +
      (endvalidity.hashCode) +
      (format.hashCode) +
      (status == null ? 0 : status!.hashCode) +
      (type.hashCode) +
      (contentType.hashCode) +
      (base64.hashCode) +
      (version == null ? 0 : version!.hashCode);

  @override
  String toString() =>
      'TravelDocumentCollectionTravelDocumentsInnerProperties[startvalidity=$startvalidity, endvalidity=$endvalidity, format=$format, status=$status, type=$type, contentType=$contentType, base64=$base64, version=$version]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'startvalidity'] = this.startvalidity.toUtc().toIso8601String();
    json[r'endvalidity'] = this.endvalidity.toUtc().toIso8601String();
    json[r'format'] = this.format;
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    json[r'type'] = this.type;
    json[r'contentType'] = this.contentType;
    json[r'base64'] = this.base64;
    if (this.version != null) {
      json[r'version'] = this.version;
    } else {
      json[r'version'] = null;
    }
    return json;
  }

  /// Returns a new [TravelDocumentCollectionTravelDocumentsInnerProperties] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TravelDocumentCollectionTravelDocumentsInnerProperties? fromJson(
      dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TravelDocumentCollectionTravelDocumentsInnerProperties[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TravelDocumentCollectionTravelDocumentsInnerProperties[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TravelDocumentCollectionTravelDocumentsInnerProperties(
        startvalidity: mapDateTime(json, r'startvalidity', r'')!,
        endvalidity: mapDateTime(json, r'endvalidity', r'')!,
        format: TravelDocumentFormat.fromJson(json[r'format'])!,
        status: TravelDocumentStatus.fromJson(json[r'status']),
        type: mapValueOfType<String>(json, r'type')!,
        contentType: mapValueOfType<String>(json, r'contentType')!,
        base64: mapValueOfType<String>(json, r'base64')!,
        version: mapValueOfType<String>(json, r'version'),
      );
    }
    return null;
  }

  static List<TravelDocumentCollectionTravelDocumentsInnerProperties>
      listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelDocumentCollectionTravelDocumentsInnerProperties>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value =
            TravelDocumentCollectionTravelDocumentsInnerProperties.fromJson(
                row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TravelDocumentCollectionTravelDocumentsInnerProperties>
      mapFromJson(dynamic json) {
    final map =
        <String, TravelDocumentCollectionTravelDocumentsInnerProperties>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value =
            TravelDocumentCollectionTravelDocumentsInnerProperties.fromJson(
                entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TravelDocumentCollectionTravelDocumentsInnerProperties-objects as value to a dart map
  static Map<String,
          List<TravelDocumentCollectionTravelDocumentsInnerProperties>>
      mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String,
        List<TravelDocumentCollectionTravelDocumentsInnerProperties>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] =
            TravelDocumentCollectionTravelDocumentsInnerProperties.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'startvalidity',
    'endvalidity',
    'format',
    'type',
    'contentType',
    'base64',
  };
}
