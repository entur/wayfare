//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Error {
  /// Returns a new [Error] instance.
  Error({
    required this.type,
    required this.title,
    required this.status,
    required this.detail,
    this.instance,
    this.links = const [],
    required this.code,
    required this.category,
    required this.hint,
    this.context = const {},
  });

  /// valid URL
  String type;

  /// short string, display names (length 0-75)
  String title;

  /// HTTP status code (100–599)
  ///
  /// Minimum value: 100
  /// Maximum value: 599
  int status;

  /// long string, memos etc (length 0-10.000)
  String detail;

  /// valid URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? instance;

  List<Link> links;

  /// Stable machine-readable problem code.
  String code;

  /// Public problem category used by curated problems.
  ErrorCategoryEnum category;

  /// Short client-facing remediation hint.
  String hint;

  /// Safe structured context fields for the problem.
  Map<String, Object> context;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Error &&
          other.type == type &&
          other.title == title &&
          other.status == status &&
          other.detail == detail &&
          other.instance == instance &&
          _deepEquality.equals(other.links, links) &&
          other.code == code &&
          other.category == category &&
          other.hint == hint &&
          _deepEquality.equals(other.context, context);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (title.hashCode) +
      (status.hashCode) +
      (detail.hashCode) +
      (instance == null ? 0 : instance!.hashCode) +
      (links.hashCode) +
      (code.hashCode) +
      (category.hashCode) +
      (hint.hashCode) +
      (context.hashCode);

  @override
  String toString() =>
      'Error[type=$type, title=$title, status=$status, detail=$detail, instance=$instance, links=$links, code=$code, category=$category, hint=$hint, context=$context]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'title'] = this.title;
    json[r'status'] = this.status;
    json[r'detail'] = this.detail;
    if (this.instance != null) {
      json[r'instance'] = this.instance;
    } else {
      json[r'instance'] = null;
    }
    json[r'links'] = this.links;
    json[r'code'] = this.code;
    json[r'category'] = this.category;
    json[r'hint'] = this.hint;
    json[r'context'] = this.context;
    return json;
  }

  /// Returns a new [Error] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Error? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Error[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Error[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Error(
        type: mapValueOfType<String>(json, r'type')!,
        title: mapValueOfType<String>(json, r'title')!,
        status: mapValueOfType<int>(json, r'status')!,
        detail: mapValueOfType<String>(json, r'detail')!,
        instance: mapValueOfType<String>(json, r'instance'),
        links: Link.listFromJson(json[r'links']),
        code: mapValueOfType<String>(json, r'code')!,
        category: ErrorCategoryEnum.fromJson(json[r'category'])!,
        hint: mapValueOfType<String>(json, r'hint')!,
        context: mapCastOfType<String, Object>(json, r'context') ?? const {},
      );
    }
    return null;
  }

  static List<Error> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Error>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Error.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Error> mapFromJson(dynamic json) {
    final map = <String, Error>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Error.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Error-objects as value to a dart map
  static Map<String, List<Error>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Error>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Error.listFromJson(
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
    'title',
    'status',
    'detail',
    'code',
    'category',
    'hint',
  };
}

/// Public problem category used by curated problems.
class ErrorCategoryEnum {
  /// Instantiate a new enum with the provided [value].
  const ErrorCategoryEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const authorization = ErrorCategoryEnum._(r'authorization');
  static const validation = ErrorCategoryEnum._(r'validation');
  static const downstream = ErrorCategoryEnum._(r'downstream');
  static const state = ErrorCategoryEnum._(r'state');
  static const resource = ErrorCategoryEnum._(r'resource');
  static const availability = ErrorCategoryEnum._(r'availability');
  static const server = ErrorCategoryEnum._(r'server');

  /// List of all possible values in this [enum][ErrorCategoryEnum].
  static const values = <ErrorCategoryEnum>[
    authorization,
    validation,
    downstream,
    state,
    resource,
    availability,
    server,
  ];

  static ErrorCategoryEnum? fromJson(dynamic value) =>
      ErrorCategoryEnumTypeTransformer().decode(value);

  static List<ErrorCategoryEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ErrorCategoryEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ErrorCategoryEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ErrorCategoryEnum] to String,
/// and [decode] dynamic data back to [ErrorCategoryEnum].
class ErrorCategoryEnumTypeTransformer {
  factory ErrorCategoryEnumTypeTransformer() =>
      _instance ??= const ErrorCategoryEnumTypeTransformer._();

  const ErrorCategoryEnumTypeTransformer._();

  String encode(ErrorCategoryEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ErrorCategoryEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ErrorCategoryEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'authorization':
          return ErrorCategoryEnum.authorization;
        case r'validation':
          return ErrorCategoryEnum.validation;
        case r'downstream':
          return ErrorCategoryEnum.downstream;
        case r'state':
          return ErrorCategoryEnum.state;
        case r'resource':
          return ErrorCategoryEnum.resource;
        case r'availability':
          return ErrorCategoryEnum.availability;
        case r'server':
          return ErrorCategoryEnum.server;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ErrorCategoryEnumTypeTransformer] instance.
  static ErrorCategoryEnumTypeTransformer? _instance;
}
