// import 'package:flutter/material.dart';
// import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mapbox;
// import 'package:geolocator/geolocator.dart' as geo;
// import 'dart:typed_data';
// import 'package:flutter/services.dart' show rootBundle;

// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();

//   const ACCESS_TOKEN = String.fromEnvironment("ACCESS_TOKEN");
//   mapbox.MapboxOptions.setAccessToken(ACCESS_TOKEN);

//   runApp(const MyApp());
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const MaterialApp(
//       home: MapPage(),
//       debugShowCheckedModeBanner: false,
//     );
//   }
// }

// class MapPage extends StatefulWidget {
//   const MapPage({super.key});

//   @override
//   State<MapPage> createState() => _MapPageState();
// }

// Future<Uint8List> loadImageBytes(String path) async {
//   final ByteData bytes = await rootBundle.load(path);
//   return bytes.buffer.asUint8List();
// }

// class _MapPageState extends State<MapPage> {
//   mapbox.MapboxMap? mapboxMap;
//   mapbox.PointAnnotationManager? annotationManager;

//   @override
//   void initState() {
//     super.initState();
//     _getLocationAndUpdateCamera();
//   }

//   Future<void> _getLocationAndUpdateCamera() async {
//   final permission = await geo.Geolocator.requestPermission();
//   if (permission == geo.LocationPermission.deniedForever) return;

//   final geo.Position position = await geo.Geolocator.getCurrentPosition();

//   final mapbox.Point userLocation = mapbox.Point(
//     coordinates: mapbox.Position(position.longitude, position.latitude),
//   );

//   if (mapboxMap != null) {
//     mapboxMap!.flyTo(
//       mapbox.CameraOptions(
//         center: userLocation,
//         zoom: 12,
//       ),
//       mapbox.MapAnimationOptions(duration: 2000),
//     );

//     if (annotationManager == null) {
//       annotationManager = await mapboxMap!.annotations.createPointAnnotationManager();
//     }

//     await annotationManager!.create(mapbox.PointAnnotationOptions(
//       geometry: userLocation,
//       image: await loadImageBytes("assets/images/pointer.png"),
//       iconSize: 0.15,
//     ));
//   }
// }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Mapbox + Geolocation')),
//       body: mapbox.MapWidget(
//         key: const ValueKey("mapWidget"),
//         cameraOptions: mapbox.CameraOptions(
//           center: mapbox.Point(
//             coordinates: mapbox.Position(0.0, 0.0),
//           ),
//           zoom: 1,
//         ),
//         onMapCreated: (controller) {
//           mapboxMap = controller;
//           _getLocationAndUpdateCamera();
//         },
//       ),
//     );
//   }
// }

// import 'dart:async';
// import 'dart:convert';
// import 'dart:typed_data';

// import 'package:flutter/material.dart';
// import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mapbox;
// import 'package:geolocator/geolocator.dart' as geo;
// import 'package:flutter/services.dart' show rootBundle;
// import 'package:http/http.dart' as http;

// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();

//   // Читаем токены, переданные через --dart-define
//   const ACCESS_TOKEN = String.fromEnvironment('ACCESS_TOKEN');
//   mapbox.MapboxOptions.setAccessToken(ACCESS_TOKEN);

//   runApp(const MyApp());
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const MaterialApp(
//       debugShowCheckedModeBanner: false,
//       home: MainNavigation(),
//     );
//   }
// }

// /// ----------
// ///  NAVIGATION
// /// ----------
// class MainNavigation extends StatefulWidget {
//   const MainNavigation({super.key});
//   @override
//   State<MainNavigation> createState() => _MainNavigationState();
// }

// class _MainNavigationState extends State<MainNavigation> {
//   int _current = 0;

//   final pages = const [
//     MapPage(),
//     RidesPage(),
//     WalletPage(),
//     ProfilePage(),
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: pages[_current],
//       bottomNavigationBar: BottomNavigationBar(
//         currentIndex: _current,
//         type: BottomNavigationBarType.fixed,
//         onTap: (i) => setState(() => _current = i),
//         items: const [
//           BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
//           BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Trips'),
//           BottomNavigationBarItem(
//               icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
//           BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
//         ],
//       ),
//     );
//   }
// }

// /// ----------
// ///  MAP PAGE
// /// ----------
// class MapPage extends StatefulWidget {
//   const MapPage({super.key});
//   @override
//   State<MapPage> createState() => _MapPageState();
// }

// class _MapPageState extends State<MapPage> {
//   mapbox.MapboxMap? _map;
//   mapbox.PointAnnotationManager? _annotations;
//   Timer? _ticker;

//   @override
//   void initState() {
//     super.initState();
//     // периодическое обновление списка самокатов
//     _ticker = Timer.periodic(const Duration(seconds: 15), (_) {
//       _fetchAndShowScooters();
//     });
//   }

//   @override
//   void dispose() {
//     _ticker?.cancel();
//     super.dispose();
//   }

//   /// Получаем текущее положение и плавно перемещаем камеру
//   Future<void> _initLocationAndCamera() async {
//     final perm = await geo.Geolocator.requestPermission();
//     if (perm == geo.LocationPermission.denied ||
//         perm == geo.LocationPermission.deniedForever) return;

//     final pos = await geo.Geolocator.getCurrentPosition();
//     final center = mapbox.Point(
//         coordinates: mapbox.Position(pos.longitude, pos.latitude));

//     await _map?.flyTo(
//       mapbox.CameraOptions(center: center, zoom: 14),
//       mapbox.MapAnimationOptions(duration: 2000),
//     );
//   }

//   /// ----- BACKEND CALL -----
//   Future<void> _fetchAndShowScooters() async {
//     if (_map == null) return;

//     const url = String.fromEnvironment('BACKEND_URL',
//         defaultValue: 'http://localhost:3000');
//     try {
//       final res = await http.get(Uri.parse('$url/scooters'));
//       if (res.statusCode != 200) {
//         debugPrint('Scooter request failed: ${res.statusCode}');
//         return;
//       }
//       final data = jsonDecode(res.body) as List;
//       final scooters = data
//           .map((e) => Scooter(
//                 id: e['id'].toString(),
//                 lat: (e['lat'] as num).toDouble(),
//                 lng: (e['lng'] as num).toDouble(),
//                 battery: e['battery'] as int?,
//               ))
//           .toList();

//       await _drawScooterMarkers(scooters);
//     } catch (e) {
//       debugPrint('Scooter request error: $e');
//     }
//   }

//   /// Отрисовываем маркеры
//   Future<void> _drawScooterMarkers(List<Scooter> list) async {
//     _annotations ??=
//         await _map!.annotations.createPointAnnotationManager();

//     // очищаем старые маркеры
//     await _annotations!.deleteAll();

//     final icon = await _loadBytes('assets/images/scooter.png');
//     for (final s in list) {
//       await _annotations!.create(mapbox.PointAnnotationOptions(
//         geometry:
//             mapbox.Point(coordinates: mapbox.Position(s.lng, s.lat)),
//         image: icon,
//         iconSize: 0.12,
//         textField: s.battery != null ? '${s.battery}%' : null,
//         textSize: 12,
//         textOffset: [0.0, 1.5],
//       ));
//     }
//   }

//   Future<Uint8List> _loadBytes(String path) async {
//     final bytes = await rootBundle.load(path);
//     return bytes.buffer.asUint8List();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: mapbox.MapWidget(
//         key: const ValueKey('map'),
//         cameraOptions: mapbox.CameraOptions(
//           center: mapbox.Point(coordinates: mapbox.Position(0, 0)),
//           zoom: 1,
//         ),
//         onMapCreated: (controller) {
//           _map = controller;
//           _initLocationAndCamera();
//           _fetchAndShowScooters();
//         },
//       ),
//     );
//   }
// }

// /// Модель самоката
// class Scooter {
//   final String id;
//   final double lat;
//   final double lng;
//   final int? battery;
//   Scooter(
//       {required this.id,
//       required this.lat,
//       required this.lng,
//       this.battery});
// }

// /// ----------
// ///  OTHER PAGES (плейсхолдеры)
// /// ----------
// class RidesPage extends StatelessWidget {
//   const RidesPage({super.key});
//   @override
//   Widget build(BuildContext context) =>
//       const Center(child: Text('История поездок'));
// }

// class WalletPage extends StatelessWidget {
//   const WalletPage({super.key});
//   @override
//   Widget build(BuildContext context) =>
//       const Center(child: Text('Кошелёк и платёжные методы'));
// }

// class ProfilePage extends StatelessWidget {
//   const ProfilePage({super.key});
//   @override
//   Widget build(BuildContext context) =>
//       const Center(child: Text('Профиль пользователя'));
// }


import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart' as geo;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mapbox;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Mapbox access-token передається через --dart-define
  const ACCESS_TOKEN = String.fromEnvironment('ACCESS_TOKEN');
  mapbox.MapboxOptions.setAccessToken(ACCESS_TOKEN);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) => const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: MainNavigation(),
      );
}

/// ---------------------------
///      BOTTOM NAVIGATION
/// ---------------------------
class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});
  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _current = 0;

  final pages = const [
    MapPage(),
    RidesPage(),
    WalletPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        body: pages[_current],
        bottomNavigationBar: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          currentIndex: _current,
          onTap: (i) => setState(() => _current = i),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
            BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Trips'),
            BottomNavigationBarItem(
                icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      );
}

/// ---------------------------
///            MAP
/// ---------------------------
class MapPage extends StatefulWidget {
  const MapPage({super.key});
  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  mapbox.MapboxMap? _map;

  mapbox.PointAnnotationManager? _scooterManager; // усі самокати
  mapbox.PointAnnotationManager? _userManager;    // тільки ваш маркер

  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    // опитуємо бекенд кожні 15 с
    _ticker = Timer.periodic(const Duration(seconds: 15), (_) {
      _fetchAndShowScooters();
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  /// -------- геолокація + маркер користувача --------
  Future<void> _initLocationAndCamera() async {
    // запит дозволу
    final perm = await geo.Geolocator.requestPermission();
    if (perm == geo.LocationPermission.denied ||
        perm == geo.LocationPermission.deniedForever) {
      return;
    }

    // координати
    final pos = await geo.Geolocator.getCurrentPosition();
    final point =
        mapbox.Point(coordinates: mapbox.Position(pos.longitude, pos.latitude));

    // центруємо карту
    await _map?.flyTo(
      mapbox.CameraOptions(center: point, zoom: 14),
      mapbox.MapAnimationOptions(duration: 1500),
    );

    // показуємо маркер
    _userManager ??=
        await _map!.annotations.createPointAnnotationManager();

    await _userManager!.deleteAll(); // перезапис

    final icon = await _loadBytes('assets/images/pointer.png');
    await _userManager!.create(
      mapbox.PointAnnotationOptions(
        geometry: point,
        image: icon,
        iconSize: 0.15,
      ),
    );
  }

  /// -------- запит самокатів --------
  Future<void> _fetchAndShowScooters() async {
    if (_map == null) return;

    const baseUrl = String.fromEnvironment('BACKEND_URL',
        defaultValue: 'http://localhost:3000');
    final url = Uri.parse('$baseUrl/scooters');

    try {
      final res = await http.get(url);
      if (res.statusCode != 200) {
        debugPrint('Scooters HTTP ${res.statusCode}');
        return;
      }

      final List<dynamic> raw = jsonDecode(res.body) as List<dynamic>;

      final List<Scooter> scooters = raw
      .map((e) => Scooter.fromJson(e as Map<String, dynamic>))
      .toList(growable: false);

await _drawScooterMarkers(scooters);
    } catch (e) {
      debugPrint('Scooters error: $e');
    }
  }

  /// -------- маркери самокатів --------
  Future<void> _drawScooterMarkers(List<Scooter> list) async {
    _scooterManager ??=
        await _map!.annotations.createPointAnnotationManager();

    await _scooterManager!.deleteAll();

    final icon = await _loadBytes('assets/images/scooter.png');
    for (final s in list) {
      await _scooterManager!.create(
        mapbox.PointAnnotationOptions(
          geometry: mapbox.Point(
              coordinates: mapbox.Position(s.lng, s.lat)),
          image: icon,
          iconSize: 0.12,
          textField: s.battery != null ? '${s.battery}%' : null,
          textSize: 12,
          textOffset: [0.0, 1.5],
        ),
      );
    }
  }

  Future<Uint8List> _loadBytes(String path) async {
    final bytes = await rootBundle.load(path);
    return bytes.buffer.asUint8List();
  }

  /// -------- UI --------
  @override
  Widget build(BuildContext context) => Scaffold(
        body: mapbox.MapWidget(
          key: const ValueKey('map'),
          cameraOptions: mapbox.CameraOptions(
            center: mapbox.Point(
                coordinates: mapbox.Position(0.0, 0.0)), // стартова точка
            zoom: 1,
          ),
          onMapCreated: (controller) {
            _map = controller;
            _initLocationAndCamera();
            _fetchAndShowScooters();
          },
        ),
      );
}

/// ---------------------------
///        DATA MODEL
/// ---------------------------
class Scooter {
  final String id;
  final double lat;
  final double lng;
  final int? battery;
  const Scooter(
      {required this.id,
      required this.lat,
      required this.lng,
      this.battery});

  factory Scooter.fromJson(Map<String, dynamic> json) => Scooter(
        id: json['id'].toString(),
        lat: (json['lat'] as num).toDouble(),
        lng: (json['lng'] as num).toDouble(),
        battery: json['battery'] as int?,
      );
}

/// ---------------------------
///      ДРУГІ СТОРІНКИ
/// ---------------------------
class RidesPage extends StatelessWidget {
  const RidesPage({super.key});
  @override
  Widget build(BuildContext context) =>
      const Center(child: Text('Історія поїздок'));
}

class WalletPage extends StatelessWidget {
  const WalletPage({super.key});
  @override
  Widget build(BuildContext context) =>
      const Center(child: Text('Гаманець'));
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});
  @override
  Widget build(BuildContext context) =>
      const Center(child: Text('Профіль'));
}
