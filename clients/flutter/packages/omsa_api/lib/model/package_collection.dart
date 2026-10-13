//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PackageCollection {
  /// Returns a new [PackageCollection] instance.
  PackageCollection({
    required this.type,
    this.packages = const [],
    this.numberMatched,
    this.numberReturned,
    this.links = const [],
  });

  PackageCollectionTypeEnum type;

  List<Package> packages;

  /// Total number of packages available (for pagination)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberMatched;

  /// Number of packages in this response
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberReturned;

  /// Actions that can be performed on this collection.
  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PackageCollection &&
          other.type == type &&
          _deepEquality.equals(other.packages, packages) &&
          other.numberMatched == numberMatched &&
          other.numberReturned == numberReturned &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (packages.hashCode) +
      (numberMatched == null ? 0 : numberMatched!.hashCode) +
      (numberReturned == null ? 0 : numberReturned!.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'PackageCollection[type=$type, packages=$packages, numberMatched=$numberMatched, numberReturned=$numberReturned, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'packages'] = this.packages;
    if (this.numberMatched != null) {
      json[r'numberMatched'] = this.numberMatched;
    } else {
      json[r'numberMatched'] = null;
    }
    if (this.numberReturned != null) {
      json[r'numberReturned'] = this.numberReturned;
    } else {
      json[r'numberReturned'] = null;
    }
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [PackageCollection] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PackageCollection? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "PackageCollection[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "PackageCollection[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return PackageCollection(
        type: PackageCollectionTypeEnum.fromJson(json[r'type'])!,
        packages: Package.listFromJson(json[r'packages']),
        numberMatched: mapValueOfType<int>(json, r'numberMatched'),
        numberReturned: mapValueOfType<int>(json, r'numberReturned'),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<PackageCollection> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageCollection>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageCollection.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PackageCollection> mapFromJson(dynamic json) {
    final map = <String, PackageCollection>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PackageCollection.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PackageCollection-objects as value to a dart map
  static Map<String, List<PackageCollection>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<PackageCollection>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PackageCollection.listFromJson(
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
    'packages',
  };
}

class PackageCollectionTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const PackageCollectionTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const packageCollection =
      PackageCollectionTypeEnum._(r'PackageCollection');

  /// List of all possible values in this [enum][PackageCollectionTypeEnum].
  static const values = <PackageCollectionTypeEnum>[
    packageCollection,
  ];

  static PackageCollectionTypeEnum? fromJson(dynamic value) =>
      PackageCollectionTypeEnumTypeTransformer().decode(value);

  static List<PackageCollectionTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PackageCollectionTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PackageCollectionTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PackageCollectionTypeEnum] to String,
/// and [decode] dynamic data back to [PackageCollectionTypeEnum].
class PackageCollectionTypeEnumTypeTransformer {
  factory PackageCollectionTypeEnumTypeTransformer() =>
      _instance ??= const PackageCollectionTypeEnumTypeTransformer._();

  const PackageCollectionTypeEnumTypeTransformer._();

  String encode(PackageCollectionTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a PackageCollectionTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PackageCollectionTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PackageCollection':
          return PackageCollectionTypeEnum.packageCollection;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PackageCollectionTypeEnumTypeTransformer] instance.
  static PackageCollectionTypeEnumTypeTransformer? _instance;
}
