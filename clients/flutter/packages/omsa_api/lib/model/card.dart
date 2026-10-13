//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Card {
  /// Returns a new [Card] instance.
  Card({
    required this.type,
    this.cardType,
    required this.cardNumber,
    this.description,
    this.additionalNumber,
    this.endValidity,
    this.country,
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  CardType? cardType;

  /// short string, display names (length 0-75)
  String cardNumber;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? additionalNumber;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? endValidity;

  /// two-letter country codes according to ISO 3166-1
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? country;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Card &&
          other.type == type &&
          other.cardType == cardType &&
          other.cardNumber == cardNumber &&
          other.description == description &&
          other.additionalNumber == additionalNumber &&
          other.endValidity == endValidity &&
          other.country == country;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (cardType == null ? 0 : cardType!.hashCode) +
      (cardNumber.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (additionalNumber == null ? 0 : additionalNumber!.hashCode) +
      (endValidity == null ? 0 : endValidity!.hashCode) +
      (country == null ? 0 : country!.hashCode);

  @override
  String toString() =>
      'Card[type=$type, cardType=$cardType, cardNumber=$cardNumber, description=$description, additionalNumber=$additionalNumber, endValidity=$endValidity, country=$country]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.cardType != null) {
      json[r'cardType'] = this.cardType;
    } else {
      json[r'cardType'] = null;
    }
    json[r'cardNumber'] = this.cardNumber;
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.additionalNumber != null) {
      json[r'additionalNumber'] = this.additionalNumber;
    } else {
      json[r'additionalNumber'] = null;
    }
    if (this.endValidity != null) {
      json[r'endValidity'] = this.endValidity;
    } else {
      json[r'endValidity'] = null;
    }
    if (this.country != null) {
      json[r'country'] = this.country;
    } else {
      json[r'country'] = null;
    }
    return json;
  }

  /// Returns a new [Card] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Card? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Card[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Card[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Card(
        type: mapValueOfType<String>(json, r'type')!,
        cardType: CardType.fromJson(json[r'cardType']),
        cardNumber: mapValueOfType<String>(json, r'cardNumber')!,
        description: mapValueOfType<String>(json, r'description'),
        additionalNumber: mapValueOfType<String>(json, r'additionalNumber'),
        endValidity: mapValueOfType<String>(json, r'endValidity'),
        country: mapValueOfType<String>(json, r'country'),
      );
    }
    return null;
  }

  static List<Card> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Card>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Card.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Card> mapFromJson(dynamic json) {
    final map = <String, Card>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Card.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Card-objects as value to a dart map
  static Map<String, List<Card>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Card>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Card.listFromJson(
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
    'cardNumber',
  };
}
