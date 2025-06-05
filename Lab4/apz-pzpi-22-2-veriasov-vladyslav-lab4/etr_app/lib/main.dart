import 'package:flutter/material.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mapbox;
import 'package:geolocator/geolocator.dart' as geo;
import 'dart:typed_data';
import 'package:flutter/services.dart' show rootBundle;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const ACCESS_TOKEN = String.fromEnvironment("ACCESS_TOKEN");
  mapbox.MapboxOptions.setAccessToken(ACCESS_TOKEN);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MapPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

Future<Uint8List> loadImageBytes(String path) async {
  final ByteData bytes = await rootBundle.load(path);
  return bytes.buffer.asUint8List();
}

class _MapPageState extends State<MapPage> {
  mapbox.MapboxMap? mapboxMap;
  mapbox.PointAnnotationManager? annotationManager;

  @override
  void initState() {
    super.initState();
    _getLocationAndUpdateCamera();
  }

  Future<void> _getLocationAndUpdateCamera() async {
  final permission = await geo.Geolocator.requestPermission();
  if (permission == geo.LocationPermission.deniedForever) return;

  final geo.Position position = await geo.Geolocator.getCurrentPosition();

  final mapbox.Point userLocation = mapbox.Point(
    coordinates: mapbox.Position(position.longitude, position.latitude),
  );

  if (mapboxMap != null) {
    mapboxMap!.flyTo(
      mapbox.CameraOptions(
        center: userLocation,
        zoom: 12,
      ),
      mapbox.MapAnimationOptions(duration: 2000),
    );

    if (annotationManager == null) {
      annotationManager = await mapboxMap!.annotations.createPointAnnotationManager();
    }

    await annotationManager!.create(mapbox.PointAnnotationOptions(
      geometry: userLocation,
      image: await loadImageBytes("assets/images/pointer.png"),
      iconSize: 0.15,
    ));
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mapbox + Geolocation')),
      body: mapbox.MapWidget(
        key: const ValueKey("mapWidget"),
        cameraOptions: mapbox.CameraOptions(
          center: mapbox.Point(
            coordinates: mapbox.Position(0.0, 0.0),
          ),
          zoom: 1,
        ),
        onMapCreated: (controller) {
          mapboxMap = controller;
          _getLocationAndUpdateCamera();
        },
      ),
    );
  }
}




// import 'package:flutter/material.dart';
// import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

// void main() {
//   WidgetsFlutterBinding.ensureInitialized();
// // Pass your access token to MapboxOptions so you can load a map
//   String ACCESS_TOKEN = const String.fromEnvironment("ACCESS_TOKEN");
//   // console.log("Access Token: $ACCESS_TOKEN");
//   // String ACCESS_TOKEN = "pk.eyJ1IjoidmxhZHZlciIsImEiOiJjbWJkZGtkbmkwNTduMmpzMjg4M2JjYjF5In0.2XOJ48oBSQeytEgL-I4erQ"
//   MapboxOptions.setAccessToken(ACCESS_TOKEN);

//   // Define options for your camera
//   CameraOptions camera = CameraOptions(
//     center: Point(coordinates: Position(-98.0, 39.5)),
//     zoom: 2,
//     bearing: 0,
//     pitch: 0);

//   // Run your application, passing your CameraOptions to the MapWidget
//   runApp(MaterialApp(home: MapWidget(
//     cameraOptions: camera,
//   )));
// }

// @override
// Widget build(BuildContext context) {
//   return Scaffold(
//     appBar: AppBar(
//       title: const Text('Mapbox Map'),
//     ),
//     body: MapWidget(
//       cameraOptions: CameraOptions(
//         center: Point(coordinates: Position(-98.0, 39.5)),
//         zoom: 2,
//         bearing: 0,
//         pitch: 0,
//       ),
//     ),
//   );
// }


