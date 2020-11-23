# visualizing-m5atom-gps
AtomicGPSをWEB上に可視化するソース一式です

## Description
 * m5atom-gps
   * M5AtomでGNSSを受信しMQTTで送信します
 * insert-pubsub-mongo
   * MQTTで受信してデータベースへ登録します
 * vector-tile-mongo
   * GNSS位置情報をベクトルタイルで返却します
 * demo-viewer
   * WEB地図へのGNSS位置情報をプロットします
 * demo-geojson-publisher
   * デモ向けとしてGeoJSONを定期的にMQTT送信します

## Usage

事前に以下サービスへの登録、機器購入が必要となります
* (必須)AtomicGPS
  * M5AtomLiteとGPSのセットです。3000円以下で購入出来ます
* (任意)[shifter.io](https://shiftr.io/)
  * 無料のMQTTブローカーです。すでに使用しているMQTTブローカーがある、自分で立てる場合は登録不要です
* (任意)[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  * MongoDBのSaaSです。無料枠でも十分使えます。自分でMongoDBを立てる場合は登録不要です。

各サービスのフローは以下の通りです。
* #### AtomicGPSを使用する場合
  * [m5stom-gps] -> [MQTTBroker] -> [insert-pubsub-mongo] -> [vector-tile-mongo] -> [demo-viewer]
* #### GeoJSONでデモする場合
  * [demo-geojson-publisher] -> [MQTTBroker] -> [insert-pubsub-mongo] -> [vector-tile-mongo] -> [demo-viewer]

詳細は各ディレクトリを参照してください

## Demo
[名古屋周辺](https://nk-tamago.github.io/visualizing-m5atom-gps/)
