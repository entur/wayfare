//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class MetadataOneOf {
  /// Returns a new [MetadataOneOf] instance.
  MetadataOneOf({
    required this.rel,
    required this.href,
    this.type,
    this.method,
    this.description,
    this.body,
    this.headers = const {},
    this.isMandatory,
    this.hash,
    this.validity,
    this.role,
  });

  /// the action that can be performed OR part of the URI allowed values include the 'processId's, prefixes for the referenced data sources, prefixes for deeplinks ('apple' and 'android'), OGC compliant ones (alternative, next, etc)
  String rel;

  /// valid URL
  String href;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  /// to indicate the http method.
  MetadataOneOfMethodEnum? method;

  /// the description of the external data source
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// the (prefilled) body for the request
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? body;

  Map<String, String> headers;

  /// is this link informative, or must it be used?
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isMandatory;

  /// to validate that the content of the link hasn't been changed.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? hash;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TemporalParameter? validity;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? role;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MetadataOneOf &&
          other.rel == rel &&
          other.href == href &&
          other.type == type &&
          other.method == method &&
          other.description == description &&
          other.body == body &&
          _deepEquality.equals(other.headers, headers) &&
          other.isMandatory == isMandatory &&
          other.hash == hash &&
          other.validity == validity &&
          other.role == role;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (rel.hashCode) +
      (href.hashCode) +
      (type == null ? 0 : type!.hashCode) +
      (method == null ? 0 : method!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (body == null ? 0 : body!.hashCode) +
      (headers.hashCode) +
      (isMandatory == null ? 0 : isMandatory!.hashCode) +
      (hash == null ? 0 : hash!.hashCode) +
      (validity == null ? 0 : validity!.hashCode) +
      (role == null ? 0 : role!.hashCode);

  @override
  String toString() =>
      'MetadataOneOf[rel=$rel, href=$href, type=$type, method=$method, description=$description, body=$body, headers=$headers, isMandatory=$isMandatory, hash=$hash, validity=$validity, role=$role]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'rel'] = this.rel;
    json[r'href'] = this.href;
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.method != null) {
      json[r'method'] = this.method;
    } else {
      json[r'method'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.body != null) {
      json[r'body'] = this.body;
    } else {
      json[r'body'] = null;
    }
    json[r'headers'] = this.headers;
    if (this.isMandatory != null) {
      json[r'isMandatory'] = this.isMandatory;
    } else {
      json[r'isMandatory'] = null;
    }
    if (this.hash != null) {
      json[r'hash'] = this.hash;
    } else {
      json[r'hash'] = null;
    }
    if (this.validity != null) {
      json[r'validity'] = this.validity;
    } else {
      json[r'validity'] = null;
    }
    if (this.role != null) {
      json[r'role'] = this.role;
    } else {
      json[r'role'] = null;
    }
    return json;
  }

  /// Returns a new [MetadataOneOf] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MetadataOneOf? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "MetadataOneOf[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "MetadataOneOf[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MetadataOneOf(
        rel: mapValueOfType<String>(json, r'rel')!,
        href: mapValueOfType<String>(json, r'href')!,
        type: mapValueOfType<String>(json, r'type'),
        method: MetadataOneOfMethodEnum.fromJson(json[r'method']),
        description: mapValueOfType<String>(json, r'description'),
        body: mapValueOfType<Object>(json, r'body'),
        headers: mapCastOfType<String, String>(json, r'headers') ?? const {},
        isMandatory: mapValueOfType<bool>(json, r'isMandatory'),
        hash: mapValueOfType<String>(json, r'hash'),
        validity: TemporalParameter.fromJson(json[r'validity']),
        role: mapValueOfType<String>(json, r'role'),
      );
    }
    return null;
  }

  static List<MetadataOneOf> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <MetadataOneOf>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MetadataOneOf.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MetadataOneOf> mapFromJson(dynamic json) {
    final map = <String, MetadataOneOf>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MetadataOneOf.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MetadataOneOf-objects as value to a dart map
  static Map<String, List<MetadataOneOf>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<MetadataOneOf>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MetadataOneOf.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'rel',
    'href',
  };
}

/// to indicate the http method.
class MetadataOneOfMethodEnum {
  /// Instantiate a new enum with the provided [value].
  const MetadataOneOfMethodEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const POST = MetadataOneOfMethodEnum._(r'POST');
  static const GET = MetadataOneOfMethodEnum._(r'GET');
  static const PUT = MetadataOneOfMethodEnum._(r'PUT');
  static const DELETE = MetadataOneOfMethodEnum._(r'DELETE');
  static const PATCH = MetadataOneOfMethodEnum._(r'PATCH');

  /// List of all possible values in this [enum][MetadataOneOfMethodEnum].
  static const values = <MetadataOneOfMethodEnum>[
    POST,
    GET,
    PUT,
    DELETE,
    PATCH,
  ];

  static MetadataOneOfMethodEnum? fromJson(dynamic value) =>
      MetadataOneOfMethodEnumTypeTransformer().decode(value);

  static List<MetadataOneOfMethodEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <MetadataOneOfMethodEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MetadataOneOfMethodEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [MetadataOneOfMethodEnum] to String,
/// and [decode] dynamic data back to [MetadataOneOfMethodEnum].
class MetadataOneOfMethodEnumTypeTransformer {
  factory MetadataOneOfMethodEnumTypeTransformer() =>
      _instance ??= const MetadataOneOfMethodEnumTypeTransformer._();

  const MetadataOneOfMethodEnumTypeTransformer._();

  String encode(MetadataOneOfMethodEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a MetadataOneOfMethodEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  MetadataOneOfMethodEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'POST':
          return MetadataOneOfMethodEnum.POST;
        case r'GET':
          return MetadataOneOfMethodEnum.GET;
        case r'PUT':
          return MetadataOneOfMethodEnum.PUT;
        case r'DELETE':
          return MetadataOneOfMethodEnum.DELETE;
        case r'PATCH':
          return MetadataOneOfMethodEnum.PATCH;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [MetadataOneOfMethodEnumTypeTransformer] instance.
  static MetadataOneOfMethodEnumTypeTransformer? _instance;
}
