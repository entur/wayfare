//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Metadata {
  /// Returns a new [Metadata] instance.
  Metadata({
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
    this.title,
    this.lang,
    this.value,
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
  MetadataMethodEnum? method;

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
  String? lang;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  MetadataOneOf1Value? value;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Metadata &&
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
          other.role == role &&
          other.title == title &&
          other.lang == lang &&
          other.value == value;

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
      (role == null ? 0 : role!.hashCode) +
      (title == null ? 0 : title!.hashCode) +
      (lang == null ? 0 : lang!.hashCode) +
      (value == null ? 0 : value!.hashCode);

  @override
  String toString() =>
      'Metadata[rel=$rel, href=$href, type=$type, method=$method, description=$description, body=$body, headers=$headers, isMandatory=$isMandatory, hash=$hash, validity=$validity, role=$role, title=$title, lang=$lang, value=$value]';

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
    if (this.title != null) {
      json[r'title'] = this.title;
    } else {
      json[r'title'] = null;
    }
    if (this.lang != null) {
      json[r'lang'] = this.lang;
    } else {
      json[r'lang'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    return json;
  }

  /// Returns a new [Metadata] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Metadata? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Metadata[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Metadata[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Metadata(
        rel: mapValueOfType<String>(json, r'rel')!,
        href: mapValueOfType<String>(json, r'href')!,
        type: mapValueOfType<String>(json, r'type'),
        method: MetadataMethodEnum.fromJson(json[r'method']),
        description: mapValueOfType<String>(json, r'description'),
        body: mapValueOfType<Object>(json, r'body'),
        headers: mapCastOfType<String, String>(json, r'headers') ?? const {},
        isMandatory: mapValueOfType<bool>(json, r'isMandatory'),
        hash: mapValueOfType<String>(json, r'hash'),
        validity: TemporalParameter.fromJson(json[r'validity']),
        role: mapValueOfType<String>(json, r'role'),
        title: mapValueOfType<String>(json, r'title'),
        lang: mapValueOfType<String>(json, r'lang'),
        value: MetadataOneOf1Value.fromJson(json[r'value']),
      );
    }
    return null;
  }

  static List<Metadata> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Metadata>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Metadata.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Metadata> mapFromJson(dynamic json) {
    final map = <String, Metadata>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Metadata.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Metadata-objects as value to a dart map
  static Map<String, List<Metadata>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Metadata>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Metadata.listFromJson(
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
class MetadataMethodEnum {
  /// Instantiate a new enum with the provided [value].
  const MetadataMethodEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const POST = MetadataMethodEnum._(r'POST');
  static const GET = MetadataMethodEnum._(r'GET');
  static const PUT = MetadataMethodEnum._(r'PUT');
  static const DELETE = MetadataMethodEnum._(r'DELETE');
  static const PATCH = MetadataMethodEnum._(r'PATCH');

  /// List of all possible values in this [enum][MetadataMethodEnum].
  static const values = <MetadataMethodEnum>[
    POST,
    GET,
    PUT,
    DELETE,
    PATCH,
  ];

  static MetadataMethodEnum? fromJson(dynamic value) =>
      MetadataMethodEnumTypeTransformer().decode(value);

  static List<MetadataMethodEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <MetadataMethodEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MetadataMethodEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [MetadataMethodEnum] to String,
/// and [decode] dynamic data back to [MetadataMethodEnum].
class MetadataMethodEnumTypeTransformer {
  factory MetadataMethodEnumTypeTransformer() =>
      _instance ??= const MetadataMethodEnumTypeTransformer._();

  const MetadataMethodEnumTypeTransformer._();

  String encode(MetadataMethodEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a MetadataMethodEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  MetadataMethodEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'POST':
          return MetadataMethodEnum.POST;
        case r'GET':
          return MetadataMethodEnum.GET;
        case r'PUT':
          return MetadataMethodEnum.PUT;
        case r'DELETE':
          return MetadataMethodEnum.DELETE;
        case r'PATCH':
          return MetadataMethodEnum.PATCH;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [MetadataMethodEnumTypeTransformer] instance.
  static MetadataMethodEnumTypeTransformer? _instance;
}
