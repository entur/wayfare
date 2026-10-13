//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProcessSummary {
  /// Returns a new [ProcessSummary] instance.
  ProcessSummary({
    this.title,
    this.description,
    this.keywords = const [],
    this.metadata = const [],
    required this.id,
    required this.version,
    this.jobControlOptions = const [],
    this.links = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? title;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  List<String> keywords;

  List<Metadata> metadata;

  String id;

  String version;

  List<JobControlOptions> jobControlOptions;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProcessSummary &&
          other.title == title &&
          other.description == description &&
          _deepEquality.equals(other.keywords, keywords) &&
          _deepEquality.equals(other.metadata, metadata) &&
          other.id == id &&
          other.version == version &&
          _deepEquality.equals(other.jobControlOptions, jobControlOptions) &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (title == null ? 0 : title!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (keywords.hashCode) +
      (metadata.hashCode) +
      (id.hashCode) +
      (version.hashCode) +
      (jobControlOptions.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'ProcessSummary[title=$title, description=$description, keywords=$keywords, metadata=$metadata, id=$id, version=$version, jobControlOptions=$jobControlOptions, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    json[r'keywords'] = this.keywords;
    json[r'metadata'] = this.metadata;
    json[r'id'] = this.id;
    json[r'version'] = this.version;
    json[r'jobControlOptions'] = this.jobControlOptions;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [ProcessSummary] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProcessSummary? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ProcessSummary[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ProcessSummary[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProcessSummary(
        title: mapValueOfType<String>(json, r'title'),
        description: mapValueOfType<String>(json, r'description'),
        keywords: json[r'keywords'] is Iterable
            ? (json[r'keywords'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        metadata: Metadata.listFromJson(json[r'metadata']),
        id: mapValueOfType<String>(json, r'id')!,
        version: mapValueOfType<String>(json, r'version')!,
        jobControlOptions:
            JobControlOptions.listFromJson(json[r'jobControlOptions']),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<ProcessSummary> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ProcessSummary>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProcessSummary.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProcessSummary> mapFromJson(dynamic json) {
    final map = <String, ProcessSummary>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProcessSummary.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProcessSummary-objects as value to a dart map
  static Map<String, List<ProcessSummary>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ProcessSummary>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProcessSummary.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'version',
  };
}
