export const cleanMapStyle: google.maps.MapTypeStyle[] = [
	{ elementType: "labels", stylers: [{ visibility: "off" }] },
	{ featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
	{ featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
	{ featureType: "poi", stylers: [{ visibility: "off" }] },
	{ featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
	{ featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
	{ featureType: "road.highway", elementType: "labels", stylers: [{ visibility: "off" }] },
	{ featureType: "road.local", stylers: [{ visibility: "off" }] },
	{ featureType: "transit", stylers: [{ visibility: "off" }] },
];

export const iconColors: string[] = ["#BFFF00", "#0078FF", "#FF4B4B", "#28A745", "#FFC107", "#9C27B0"];

export const testeFloorShapes: object[] = [
	{
		name: "T",
		shapes: {
			markers: [
				{
					position: {
						lat: -28.671687126807292,
						lng: -49.37371163318501
					},
					centered: false,
					zoom: 20,
					name: "Novo Marcador",
					icon: 2,
					description: "desc"
				},
				{
					position: {
						lat: -28.67140237402773,
						lng: -49.37370090434895
					},
					centered: true,
					zoom: 19,
					name: "dsdsa",
					icon: 1,
					description: "dsdasd"
				}
			],
			circles: [
				{
					center: {
						lat: -28.671309230841054,
						lng: -49.37339267657067
					},
					radius: 7.597184776719742,
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			rectangles: [
				{
					bounds: {
						north: -28.671781580871027,
						east: -49.37347045753074,
						south: -28.671893363674677,
						west: -49.37356701705528
					},
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			polygons: [
				{
					path: [
						{ lat: -28.671497497395638, lng: -49.373462414005054 },
						{ lat: -28.671596337201375, lng: -49.373336350181354 },
						{ lat: -28.67146925743401, lng: -49.37329611704613 },
						{ lat: -28.671419837482855, lng: -49.37339535877968 }
					],
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			polylines: [
				{
					path: [
						{ lat: -28.671551623967474, lng: -49.37348118946816 }
					],
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				},
				{
					path: [
						{ lat: -28.671626930455687, lng: -49.37353751585747 }
					],
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				},
				{
					path: [
						{ lat: -28.671546917310163, lng: -49.37348118946816 }
					],
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				},
				{
					path: [
						{ lat: -28.671619201428026, lng: -49.37352410171104 },
						{ lat: -28.67169803785571, lng: -49.37354421827865 },
						{ lat: -28.671743927689274, lng: -49.373422177768475 },
						{ lat: -28.671626261409042, lng: -49.373385967946774 },
						{ lat: -28.671619201428026, lng: -49.37352410171104 }
					],
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			]
		}
	},
	{
		name: "2",
		shapes: {
			markers: [
				{
					position: {
						lat: -28.671645088022757,
						lng: -49.373643460012204
					},
					centered: true,
					zoom: 17,
					name: "Novo Madddrcador",
					icon: 3,
					description: "aaaa"
				},
				{
					position: {
						lat: -28.671813350732616,
						lng: -49.37359249804092
					},
					centered: false,
					zoom: 20,
					name: "Novo dsaMarcador",
					icon: 5,
					description: "ddd"
				}
			],
			circles: [
				{
					center: {
						lat: -28.6715191849792,
						lng: -49.37357238147331
					},
					radius: 5.801941284984873,
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			rectangles: [
				{
					bounds: {
						north: -28.67169097787953,
						east: -49.37336853358818,
						south: -28.671732161067183,
						west: -49.37339937899185
					},
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			polygons: [
				{
					path: [
						{ lat: -28.67150977166147, lng: -49.373463752008206 },
						{ lat: -28.6715933148269, lng: -49.373459728694684 },
						{ lat: -28.671578018195955, lng: -49.37336585137916 },
						{ lat: -28.6714862383634, lng: -49.37337389800621 }
					],
					fillColor: "#b3b3b3ff",
					fillOpacity: 1,
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			],
			polylines: [
				{
					path: [
						{ lat: -28.67155330824895, lng: -49.373506667352444 },
						{ lat: -28.671645088022757, lng: -49.37352812502456 },
						{ lat: -28.671687447891248, lng: -49.37346777532173 },
						{ lat: -28.671626261409042, lng: -49.373422177768475 },
						{ lat: -28.67155330824895, lng: -49.373506667352444 }
					],
					strokeColor: "#b3b3b3ff",
					strokeOpacity: 1,
					strokeWeight: 3
				}
			]
		}
	}
];