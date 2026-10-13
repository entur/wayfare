//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProcessList {
  /// Returns a new [ProcessList] instance.
  ProcessList({
    this.processes = const [],
    this.links = const [],
  });

  List<ProcessSummary> processes;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProcessList &&
          _deepEquality.equals(other.processes, processes) &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (processes.hashCode) + (links.hashCode);

  @override
  String toString() => 'ProcessList[processes=$processes, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'processes'] = this.processes;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [ProcessList] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProcessList? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ProcessList[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ProcessList[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProcessList(
        processes: ProcessSummary.listFromJson(json[r'processes']),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<ProcessList> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ProcessList>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProcessList.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProcessList> mapFromJson(dynamic json) {
    final map = <String, ProcessList>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProcessList.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProcessList-objects as value to a dart map
  static Map<String, List<ProcessList>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ProcessList>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProcessList.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'processes',
    'links',
  };
}
