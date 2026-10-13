//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CollectionInfo {
  /// Returns a new [CollectionInfo] instance.
  CollectionInfo({
    required this.id,
    this.title,
    this.description,
    this.links = const [],
    this.extent,
    this.itemType = 'unknown',
    this.crs = const [],
    this.dataType,
    this.geometryDimension,
    this.minScaleDenominator,
    this.maxScaleDenominator,
    this.minCellSize,
    this.maxCellSize,
  });

  /// identifier of the collection used, for example, in URIs
  String id;

  /// human readable title of the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? title;

  /// a description of the data in the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  List<Link> links;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? extent;

  /// indicator about the type of the items in the collection if the collection has an accessible /collections/{collectionId}/items endpoint
  String itemType;

  /// the list of coordinate reference systems supported by the API; the first item is the default coordinate reference system
  List<String> crs;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DataType? dataType;

  /// The geometry dimension of the features shown in this layer (0: points, 1: curves, 2: surfaces, 3: solids), unspecified: mixed or unknown
  ///
  /// Minimum value: 0
  /// Maximum value: 3
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? geometryDimension;

  /// Minimum scale denominator for usage of the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? minScaleDenominator;

  /// Maximum scale denominator for usage of the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? maxScaleDenominator;

  /// Minimum cell size for usage of the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? minCellSize;

  /// Maximum cell size for usage of the collection
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? maxCellSize;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CollectionInfo &&
          other.id == id &&
          other.title == title &&
          other.description == description &&
          _deepEquality.equals(other.links, links) &&
          other.extent == extent &&
          other.itemType == itemType &&
          _deepEquality.equals(other.crs, crs) &&
          other.dataType == dataType &&
          other.geometryDimension == geometryDimension &&
          other.minScaleDenominator == minScaleDenominator &&
          other.maxScaleDenominator == maxScaleDenominator &&
          other.minCellSize == minCellSize &&
          other.maxCellSize == maxCellSize;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id.hashCode) +
      (title == null ? 0 : title!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (links.hashCode) +
      (extent == null ? 0 : extent!.hashCode) +
      (itemType.hashCode) +
      (crs.hashCode) +
      (dataType == null ? 0 : dataType!.hashCode) +
      (geometryDimension == null ? 0 : geometryDimension!.hashCode) +
      (minScaleDenominator == null ? 0 : minScaleDenominator!.hashCode) +
      (maxScaleDenominator == null ? 0 : maxScaleDenominator!.hashCode) +
      (minCellSize == null ? 0 : minCellSize!.hashCode) +
      (maxCellSize == null ? 0 : maxCellSize!.hashCode);

  @override
  String toString() =>
      'CollectionInfo[id=$id, title=$title, description=$description, links=$links, extent=$extent, itemType=$itemType, crs=$crs, dataType=$dataType, geometryDimension=$geometryDimension, minScaleDenominator=$minScaleDenominator, maxScaleDenominator=$maxScaleDenominator, minCellSize=$minCellSize, maxCellSize=$maxCellSize]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'id'] = this.id;
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
    json[r'links'] = this.links;
    if (this.extent != null) {
      json[r'extent'] = this.extent;
    } else {
      json[r'extent'] = null;
    }
    json[r'itemType'] = this.itemType;
    json[r'crs'] = this.crs;
    if (this.dataType != null) {
      json[r'dataType'] = this.dataType;
    } else {
      json[r'dataType'] = null;
    }
    if (this.geometryDimension != null) {
      json[r'geometryDimension'] = this.geometryDimension;
    } else {
      json[r'geometryDimension'] = null;
    }
    if (this.minScaleDenominator != null) {
      json[r'minScaleDenominator'] = this.minScaleDenominator;
    } else {
      json[r'minScaleDenominator'] = null;
    }
    if (this.maxScaleDenominator != null) {
      json[r'maxScaleDenominator'] = this.maxScaleDenominator;
    } else {
      json[r'maxScaleDenominator'] = null;
    }
    if (this.minCellSize != null) {
      json[r'minCellSize'] = this.minCellSize;
    } else {
      json[r'minCellSize'] = null;
    }
    if (this.maxCellSize != null) {
      json[r'maxCellSize'] = this.maxCellSize;
    } else {
      json[r'maxCellSize'] = null;
    }
    return json;
  }

  /// Returns a new [CollectionInfo] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CollectionInfo? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "CollectionInfo[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "CollectionInfo[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CollectionInfo(
        id: mapValueOfType<String>(json, r'id')!,
        title: mapValueOfType<String>(json, r'title'),
        description: mapValueOfType<String>(json, r'description'),
        links: Link.listFromJson(json[r'links']),
        extent: mapValueOfType<Object>(json, r'extent'),
        itemType: mapValueOfType<String>(json, r'itemType') ?? 'unknown',
        crs: json[r'crs'] is Iterable
            ? (json[r'crs'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        dataType: DataType.fromJson(json[r'dataType']),
        geometryDimension: mapValueOfType<int>(json, r'geometryDimension'),
        minScaleDenominator: num.parse('${json[r'minScaleDenominator']}'),
        maxScaleDenominator: num.parse('${json[r'maxScaleDenominator']}'),
        minCellSize: num.parse('${json[r'minCellSize']}'),
        maxCellSize: num.parse('${json[r'maxCellSize']}'),
      );
    }
    return null;
  }

  static List<CollectionInfo> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CollectionInfo>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CollectionInfo.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CollectionInfo> mapFromJson(dynamic json) {
    final map = <String, CollectionInfo>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CollectionInfo.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CollectionInfo-objects as value to a dart map
  static Map<String, List<CollectionInfo>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<CollectionInfo>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CollectionInfo.listFromJson(
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
    'links',
  };
}
