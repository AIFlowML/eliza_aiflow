Directory Structure:

└── ./
    └── docs
        ├── grpc
        │   └── docs.md
        ├── redoc
        │   ├── v0.11.6
        │   │   └── openapi.json
        │   ├── v0.11.7
        │   │   └── openapi.json
        │   ├── default_version.js
        │   └── index.html
        ├── roadmap
        │   ├── README.md
        │   ├── roadmap-2022.md
        │   └── roadmap-2023.md
        ├── CODE_OF_CONDUCT.md
        ├── CONTRIBUTING.md
        ├── DEVELOPMENT.md
        └── QUICK_START.md



---
File: /docs/grpc/docs.md
---

# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [collections.proto](#collections-proto)
    - [AbortShardTransfer](#qdrant-AbortShardTransfer)
    - [AliasDescription](#qdrant-AliasDescription)
    - [AliasOperations](#qdrant-AliasOperations)
    - [BinaryQuantization](#qdrant-BinaryQuantization)
    - [BoolIndexParams](#qdrant-BoolIndexParams)
    - [ChangeAliases](#qdrant-ChangeAliases)
    - [CollectionClusterInfoRequest](#qdrant-CollectionClusterInfoRequest)
    - [CollectionClusterInfoResponse](#qdrant-CollectionClusterInfoResponse)
    - [CollectionConfig](#qdrant-CollectionConfig)
    - [CollectionDescription](#qdrant-CollectionDescription)
    - [CollectionExists](#qdrant-CollectionExists)
    - [CollectionExistsRequest](#qdrant-CollectionExistsRequest)
    - [CollectionExistsResponse](#qdrant-CollectionExistsResponse)
    - [CollectionInfo](#qdrant-CollectionInfo)
    - [CollectionInfo.PayloadSchemaEntry](#qdrant-CollectionInfo-PayloadSchemaEntry)
    - [CollectionOperationResponse](#qdrant-CollectionOperationResponse)
    - [CollectionParams](#qdrant-CollectionParams)
    - [CollectionParamsDiff](#qdrant-CollectionParamsDiff)
    - [CreateAlias](#qdrant-CreateAlias)
    - [CreateCollection](#qdrant-CreateCollection)
    - [CreateShardKey](#qdrant-CreateShardKey)
    - [CreateShardKeyRequest](#qdrant-CreateShardKeyRequest)
    - [CreateShardKeyResponse](#qdrant-CreateShardKeyResponse)
    - [DatetimeIndexParams](#qdrant-DatetimeIndexParams)
    - [DeleteAlias](#qdrant-DeleteAlias)
    - [DeleteCollection](#qdrant-DeleteCollection)
    - [DeleteShardKey](#qdrant-DeleteShardKey)
    - [DeleteShardKeyRequest](#qdrant-DeleteShardKeyRequest)
    - [DeleteShardKeyResponse](#qdrant-DeleteShardKeyResponse)
    - [Disabled](#qdrant-Disabled)
    - [FloatIndexParams](#qdrant-FloatIndexParams)
    - [GeoIndexParams](#qdrant-GeoIndexParams)
    - [GetCollectionInfoRequest](#qdrant-GetCollectionInfoRequest)
    - [GetCollectionInfoResponse](#qdrant-GetCollectionInfoResponse)
    - [HnswConfigDiff](#qdrant-HnswConfigDiff)
    - [IntegerIndexParams](#qdrant-IntegerIndexParams)
    - [KeywordIndexParams](#qdrant-KeywordIndexParams)
    - [ListAliasesRequest](#qdrant-ListAliasesRequest)
    - [ListAliasesResponse](#qdrant-ListAliasesResponse)
    - [ListCollectionAliasesRequest](#qdrant-ListCollectionAliasesRequest)
    - [ListCollectionsRequest](#qdrant-ListCollectionsRequest)
    - [ListCollectionsResponse](#qdrant-ListCollectionsResponse)
    - [LocalShardInfo](#qdrant-LocalShardInfo)
    - [MoveShard](#qdrant-MoveShard)
    - [MultiVectorConfig](#qdrant-MultiVectorConfig)
    - [OptimizerStatus](#qdrant-OptimizerStatus)
    - [OptimizersConfigDiff](#qdrant-OptimizersConfigDiff)
    - [PayloadIndexParams](#qdrant-PayloadIndexParams)
    - [PayloadSchemaInfo](#qdrant-PayloadSchemaInfo)
    - [ProductQuantization](#qdrant-ProductQuantization)
    - [QuantizationConfig](#qdrant-QuantizationConfig)
    - [QuantizationConfigDiff](#qdrant-QuantizationConfigDiff)
    - [RemoteShardInfo](#qdrant-RemoteShardInfo)
    - [RenameAlias](#qdrant-RenameAlias)
    - [Replica](#qdrant-Replica)
    - [ReplicateShard](#qdrant-ReplicateShard)
    - [ReshardingInfo](#qdrant-ReshardingInfo)
    - [RestartTransfer](#qdrant-RestartTransfer)
    - [ScalarQuantization](#qdrant-ScalarQuantization)
    - [ShardKey](#qdrant-ShardKey)
    - [ShardTransferInfo](#qdrant-ShardTransferInfo)
    - [SparseIndexConfig](#qdrant-SparseIndexConfig)
    - [SparseVectorConfig](#qdrant-SparseVectorConfig)
    - [SparseVectorConfig.MapEntry](#qdrant-SparseVectorConfig-MapEntry)
    - [SparseVectorParams](#qdrant-SparseVectorParams)
    - [StrictModeConfig](#qdrant-StrictModeConfig)
    - [TextIndexParams](#qdrant-TextIndexParams)
    - [UpdateCollection](#qdrant-UpdateCollection)
    - [UpdateCollectionClusterSetupRequest](#qdrant-UpdateCollectionClusterSetupRequest)
    - [UpdateCollectionClusterSetupResponse](#qdrant-UpdateCollectionClusterSetupResponse)
    - [UuidIndexParams](#qdrant-UuidIndexParams)
    - [VectorParams](#qdrant-VectorParams)
    - [VectorParamsDiff](#qdrant-VectorParamsDiff)
    - [VectorParamsDiffMap](#qdrant-VectorParamsDiffMap)
    - [VectorParamsDiffMap.MapEntry](#qdrant-VectorParamsDiffMap-MapEntry)
    - [VectorParamsMap](#qdrant-VectorParamsMap)
    - [VectorParamsMap.MapEntry](#qdrant-VectorParamsMap-MapEntry)
    - [VectorsConfig](#qdrant-VectorsConfig)
    - [VectorsConfigDiff](#qdrant-VectorsConfigDiff)
    - [WalConfigDiff](#qdrant-WalConfigDiff)

    - [CollectionStatus](#qdrant-CollectionStatus)
    - [CompressionRatio](#qdrant-CompressionRatio)
    - [Datatype](#qdrant-Datatype)
    - [Distance](#qdrant-Distance)
    - [Modifier](#qdrant-Modifier)
    - [MultiVectorComparator](#qdrant-MultiVectorComparator)
    - [PayloadSchemaType](#qdrant-PayloadSchemaType)
    - [QuantizationType](#qdrant-QuantizationType)
    - [ReplicaState](#qdrant-ReplicaState)
    - [ShardTransferMethod](#qdrant-ShardTransferMethod)
    - [ShardingMethod](#qdrant-ShardingMethod)
    - [TokenizerType](#qdrant-TokenizerType)

- [collections_service.proto](#collections_service-proto)
    - [Collections](#qdrant-Collections)

- [health_check.proto](#health_check-proto)
    - [HealthCheckRequest](#grpc-health-v1-HealthCheckRequest)
    - [HealthCheckResponse](#grpc-health-v1-HealthCheckResponse)

    - [HealthCheckResponse.ServingStatus](#grpc-health-v1-HealthCheckResponse-ServingStatus)

    - [Health](#grpc-health-v1-Health)

- [json_with_int.proto](#json_with_int-proto)
    - [ListValue](#qdrant-ListValue)
    - [Struct](#qdrant-Struct)
    - [Struct.FieldsEntry](#qdrant-Struct-FieldsEntry)
    - [Value](#qdrant-Value)

    - [NullValue](#qdrant-NullValue)

- [points.proto](#points-proto)
    - [BatchResult](#qdrant-BatchResult)
    - [ClearPayloadPoints](#qdrant-ClearPayloadPoints)
    - [Condition](#qdrant-Condition)
    - [ContextExamplePair](#qdrant-ContextExamplePair)
    - [ContextInput](#qdrant-ContextInput)
    - [ContextInputPair](#qdrant-ContextInputPair)
    - [CountPoints](#qdrant-CountPoints)
    - [CountResponse](#qdrant-CountResponse)
    - [CountResult](#qdrant-CountResult)
    - [CreateFieldIndexCollection](#qdrant-CreateFieldIndexCollection)
    - [DatetimeRange](#qdrant-DatetimeRange)
    - [DeleteFieldIndexCollection](#qdrant-DeleteFieldIndexCollection)
    - [DeletePayloadPoints](#qdrant-DeletePayloadPoints)
    - [DeletePointVectors](#qdrant-DeletePointVectors)
    - [DeletePoints](#qdrant-DeletePoints)
    - [DenseVector](#qdrant-DenseVector)
    - [DiscoverBatchPoints](#qdrant-DiscoverBatchPoints)
    - [DiscoverBatchResponse](#qdrant-DiscoverBatchResponse)
    - [DiscoverInput](#qdrant-DiscoverInput)
    - [DiscoverPoints](#qdrant-DiscoverPoints)
    - [DiscoverResponse](#qdrant-DiscoverResponse)
    - [Document](#qdrant-Document)
    - [Document.OptionsEntry](#qdrant-Document-OptionsEntry)
    - [FacetCounts](#qdrant-FacetCounts)
    - [FacetHit](#qdrant-FacetHit)
    - [FacetResponse](#qdrant-FacetResponse)
    - [FacetValue](#qdrant-FacetValue)
    - [FieldCondition](#qdrant-FieldCondition)
    - [Filter](#qdrant-Filter)
    - [GeoBoundingBox](#qdrant-GeoBoundingBox)
    - [GeoLineString](#qdrant-GeoLineString)
    - [GeoPoint](#qdrant-GeoPoint)
    - [GeoPolygon](#qdrant-GeoPolygon)
    - [GeoRadius](#qdrant-GeoRadius)
    - [GetPoints](#qdrant-GetPoints)
    - [GetResponse](#qdrant-GetResponse)
    - [GroupId](#qdrant-GroupId)
    - [GroupsResult](#qdrant-GroupsResult)
    - [HardwareUsage](#qdrant-HardwareUsage)
    - [HasIdCondition](#qdrant-HasIdCondition)
    - [HasVectorCondition](#qdrant-HasVectorCondition)
    - [Image](#qdrant-Image)
    - [Image.OptionsEntry](#qdrant-Image-OptionsEntry)
    - [InferenceObject](#qdrant-InferenceObject)
    - [InferenceObject.OptionsEntry](#qdrant-InferenceObject-OptionsEntry)
    - [IsEmptyCondition](#qdrant-IsEmptyCondition)
    - [IsNullCondition](#qdrant-IsNullCondition)
    - [LookupLocation](#qdrant-LookupLocation)
    - [Match](#qdrant-Match)
    - [MinShould](#qdrant-MinShould)
    - [MultiDenseVector](#qdrant-MultiDenseVector)
    - [NamedVectors](#qdrant-NamedVectors)
    - [NamedVectors.VectorsEntry](#qdrant-NamedVectors-VectorsEntry)
    - [NamedVectorsOutput](#qdrant-NamedVectorsOutput)
    - [NamedVectorsOutput.VectorsEntry](#qdrant-NamedVectorsOutput-VectorsEntry)
    - [NestedCondition](#qdrant-NestedCondition)
    - [OrderBy](#qdrant-OrderBy)
    - [OrderValue](#qdrant-OrderValue)
    - [PayloadExcludeSelector](#qdrant-PayloadExcludeSelector)
    - [PayloadIncludeSelector](#qdrant-PayloadIncludeSelector)
    - [PointGroup](#qdrant-PointGroup)
    - [PointId](#qdrant-PointId)
    - [PointStruct](#qdrant-PointStruct)
    - [PointStruct.PayloadEntry](#qdrant-PointStruct-PayloadEntry)
    - [PointVectors](#qdrant-PointVectors)
    - [PointsIdsList](#qdrant-PointsIdsList)
    - [PointsOperationResponse](#qdrant-PointsOperationResponse)
    - [PointsSelector](#qdrant-PointsSelector)
    - [PointsUpdateOperation](#qdrant-PointsUpdateOperation)
    - [PointsUpdateOperation.ClearPayload](#qdrant-PointsUpdateOperation-ClearPayload)
    - [PointsUpdateOperation.DeletePayload](#qdrant-PointsUpdateOperation-DeletePayload)
    - [PointsUpdateOperation.DeletePoints](#qdrant-PointsUpdateOperation-DeletePoints)
    - [PointsUpdateOperation.DeleteVectors](#qdrant-PointsUpdateOperation-DeleteVectors)
    - [PointsUpdateOperation.OverwritePayload](#qdrant-PointsUpdateOperation-OverwritePayload)
    - [PointsUpdateOperation.OverwritePayload.PayloadEntry](#qdrant-PointsUpdateOperation-OverwritePayload-PayloadEntry)
    - [PointsUpdateOperation.PointStructList](#qdrant-PointsUpdateOperation-PointStructList)
    - [PointsUpdateOperation.SetPayload](#qdrant-PointsUpdateOperation-SetPayload)
    - [PointsUpdateOperation.SetPayload.PayloadEntry](#qdrant-PointsUpdateOperation-SetPayload-PayloadEntry)
    - [PointsUpdateOperation.UpdateVectors](#qdrant-PointsUpdateOperation-UpdateVectors)
    - [PrefetchQuery](#qdrant-PrefetchQuery)
    - [QuantizationSearchParams](#qdrant-QuantizationSearchParams)
    - [Query](#qdrant-Query)
    - [QueryBatchPoints](#qdrant-QueryBatchPoints)
    - [QueryBatchResponse](#qdrant-QueryBatchResponse)
    - [QueryGroupsResponse](#qdrant-QueryGroupsResponse)
    - [QueryPointGroups](#qdrant-QueryPointGroups)
    - [QueryPoints](#qdrant-QueryPoints)
    - [QueryResponse](#qdrant-QueryResponse)
    - [Range](#qdrant-Range)
    - [ReadConsistency](#qdrant-ReadConsistency)
    - [RecommendBatchPoints](#qdrant-RecommendBatchPoints)
    - [RecommendBatchResponse](#qdrant-RecommendBatchResponse)
    - [RecommendGroupsResponse](#qdrant-RecommendGroupsResponse)
    - [RecommendInput](#qdrant-RecommendInput)
    - [RecommendPointGroups](#qdrant-RecommendPointGroups)
    - [RecommendPoints](#qdrant-RecommendPoints)
    - [RecommendResponse](#qdrant-RecommendResponse)
    - [RepeatedIntegers](#qdrant-RepeatedIntegers)
    - [RepeatedStrings](#qdrant-RepeatedStrings)
    - [RetrievedPoint](#qdrant-RetrievedPoint)
    - [RetrievedPoint.PayloadEntry](#qdrant-RetrievedPoint-PayloadEntry)
    - [ScoredPoint](#qdrant-ScoredPoint)
    - [ScoredPoint.PayloadEntry](#qdrant-ScoredPoint-PayloadEntry)
    - [ScrollPoints](#qdrant-ScrollPoints)
    - [ScrollResponse](#qdrant-ScrollResponse)
    - [SearchBatchPoints](#qdrant-SearchBatchPoints)
    - [SearchBatchResponse](#qdrant-SearchBatchResponse)
    - [SearchGroupsResponse](#qdrant-SearchGroupsResponse)
    - [SearchMatrixOffsets](#qdrant-SearchMatrixOffsets)
    - [SearchMatrixOffsetsResponse](#qdrant-SearchMatrixOffsetsResponse)
    - [SearchMatrixPair](#qdrant-SearchMatrixPair)
    - [SearchMatrixPairs](#qdrant-SearchMatrixPairs)
    - [SearchMatrixPairsResponse](#qdrant-SearchMatrixPairsResponse)
    - [SearchMatrixPoints](#qdrant-SearchMatrixPoints)
    - [SearchParams](#qdrant-SearchParams)
    - [SearchPointGroups](#qdrant-SearchPointGroups)
    - [SearchPoints](#qdrant-SearchPoints)
    - [SearchResponse](#qdrant-SearchResponse)
    - [SetPayloadPoints](#qdrant-SetPayloadPoints)
    - [SetPayloadPoints.PayloadEntry](#qdrant-SetPayloadPoints-PayloadEntry)
    - [ShardKeySelector](#qdrant-ShardKeySelector)
    - [SparseIndices](#qdrant-SparseIndices)
    - [SparseVector](#qdrant-SparseVector)
    - [StartFrom](#qdrant-StartFrom)
    - [TargetVector](#qdrant-TargetVector)
    - [UpdateBatchPoints](#qdrant-UpdateBatchPoints)
    - [UpdateBatchResponse](#qdrant-UpdateBatchResponse)
    - [UpdatePointVectors](#qdrant-UpdatePointVectors)
    - [UpdateResult](#qdrant-UpdateResult)
    - [UpsertPoints](#qdrant-UpsertPoints)
    - [ValuesCount](#qdrant-ValuesCount)
    - [Vector](#qdrant-Vector)
    - [VectorExample](#qdrant-VectorExample)
    - [VectorInput](#qdrant-VectorInput)
    - [VectorOutput](#qdrant-VectorOutput)
    - [Vectors](#qdrant-Vectors)
    - [VectorsOutput](#qdrant-VectorsOutput)
    - [VectorsSelector](#qdrant-VectorsSelector)
    - [WithLookup](#qdrant-WithLookup)
    - [WithPayloadSelector](#qdrant-WithPayloadSelector)
    - [WithVectorsSelector](#qdrant-WithVectorsSelector)
    - [WriteOrdering](#qdrant-WriteOrdering)

    - [Direction](#qdrant-Direction)
    - [FieldType](#qdrant-FieldType)
    - [Fusion](#qdrant-Fusion)
    - [ReadConsistencyType](#qdrant-ReadConsistencyType)
    - [RecommendStrategy](#qdrant-RecommendStrategy)
    - [Sample](#qdrant-Sample)
    - [UpdateStatus](#qdrant-UpdateStatus)
    - [WriteOrderingType](#qdrant-WriteOrderingType)

- [points_service.proto](#points_service-proto)
    - [Points](#qdrant-Points)

- [qdrant.proto](#qdrant-proto)
    - [HealthCheckReply](#qdrant-HealthCheckReply)
    - [HealthCheckRequest](#qdrant-HealthCheckRequest)

    - [Qdrant](#qdrant-Qdrant)

- [qdrant_internal_service.proto](#qdrant_internal_service-proto)
    - [GetConsensusCommitRequest](#qdrant-GetConsensusCommitRequest)
    - [GetConsensusCommitResponse](#qdrant-GetConsensusCommitResponse)
    - [WaitOnConsensusCommitRequest](#qdrant-WaitOnConsensusCommitRequest)
    - [WaitOnConsensusCommitResponse](#qdrant-WaitOnConsensusCommitResponse)

    - [QdrantInternal](#qdrant-QdrantInternal)

- [snapshots_service.proto](#snapshots_service-proto)
    - [CreateFullSnapshotRequest](#qdrant-CreateFullSnapshotRequest)
    - [CreateSnapshotRequest](#qdrant-CreateSnapshotRequest)
    - [CreateSnapshotResponse](#qdrant-CreateSnapshotResponse)
    - [DeleteFullSnapshotRequest](#qdrant-DeleteFullSnapshotRequest)
    - [DeleteSnapshotRequest](#qdrant-DeleteSnapshotRequest)
    - [DeleteSnapshotResponse](#qdrant-DeleteSnapshotResponse)
    - [ListFullSnapshotsRequest](#qdrant-ListFullSnapshotsRequest)
    - [ListSnapshotsRequest](#qdrant-ListSnapshotsRequest)
    - [ListSnapshotsResponse](#qdrant-ListSnapshotsResponse)
    - [SnapshotDescription](#qdrant-SnapshotDescription)

    - [Snapshots](#qdrant-Snapshots)

- [Scalar Value Types](#scalar-value-types)



<a name="collections-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## collections.proto



<a name="qdrant-AbortShardTransfer"></a>

### AbortShardTransfer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| to_shard_id | [uint32](#uint32) | optional |  |
| from_peer_id | [uint64](#uint64) |  |  |
| to_peer_id | [uint64](#uint64) |  |  |






<a name="qdrant-AliasDescription"></a>

### AliasDescription



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| alias_name | [string](#string) |  | Name of the alias |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-AliasOperations"></a>

### AliasOperations



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| create_alias | [CreateAlias](#qdrant-CreateAlias) |  |  |
| rename_alias | [RenameAlias](#qdrant-RenameAlias) |  |  |
| delete_alias | [DeleteAlias](#qdrant-DeleteAlias) |  |  |






<a name="qdrant-BinaryQuantization"></a>

### BinaryQuantization



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| always_ram | [bool](#bool) | optional | If true - quantized vectors always will be stored in RAM, ignoring the config of main storage |






<a name="qdrant-BoolIndexParams"></a>

### BoolIndexParams







<a name="qdrant-ChangeAliases"></a>

### ChangeAliases



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| actions | [AliasOperations](#qdrant-AliasOperations) | repeated | List of actions |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |






<a name="qdrant-CollectionClusterInfoRequest"></a>

### CollectionClusterInfoRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-CollectionClusterInfoResponse"></a>

### CollectionClusterInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer_id | [uint64](#uint64) |  | ID of this peer |
| shard_count | [uint64](#uint64) |  | Total number of shards |
| local_shards | [LocalShardInfo](#qdrant-LocalShardInfo) | repeated | Local shards |
| remote_shards | [RemoteShardInfo](#qdrant-RemoteShardInfo) | repeated | Remote shards |
| shard_transfers | [ShardTransferInfo](#qdrant-ShardTransferInfo) | repeated | Shard transfers |






<a name="qdrant-CollectionConfig"></a>

### CollectionConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| params | [CollectionParams](#qdrant-CollectionParams) |  | Collection parameters |
| hnsw_config | [HnswConfigDiff](#qdrant-HnswConfigDiff) |  | Configuration of vector index |
| optimizer_config | [OptimizersConfigDiff](#qdrant-OptimizersConfigDiff) |  | Configuration of the optimizers |
| wal_config | [WalConfigDiff](#qdrant-WalConfigDiff) |  | Configuration of the Write-Ahead-Log |
| quantization_config | [QuantizationConfig](#qdrant-QuantizationConfig) | optional | Configuration of the vector quantization |
| strict_mode_config | [StrictModeConfig](#qdrant-StrictModeConfig) | optional | Configuration of strict mode. |






<a name="qdrant-CollectionDescription"></a>

### CollectionDescription



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  | Name of the collection |






<a name="qdrant-CollectionExists"></a>

### CollectionExists



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| exists | [bool](#bool) |  |  |






<a name="qdrant-CollectionExistsRequest"></a>

### CollectionExistsRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  |  |






<a name="qdrant-CollectionExistsResponse"></a>

### CollectionExistsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [CollectionExists](#qdrant-CollectionExists) |  |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-CollectionInfo"></a>

### CollectionInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [CollectionStatus](#qdrant-CollectionStatus) |  | operating condition of the collection |
| optimizer_status | [OptimizerStatus](#qdrant-OptimizerStatus) |  | status of collection optimizers |
| vectors_count | [uint64](#uint64) | optional | Approximate number of vectors in the collection |
| segments_count | [uint64](#uint64) |  | Number of independent segments |
| config | [CollectionConfig](#qdrant-CollectionConfig) |  | Configuration |
| payload_schema | [CollectionInfo.PayloadSchemaEntry](#qdrant-CollectionInfo-PayloadSchemaEntry) | repeated | Collection data types |
| points_count | [uint64](#uint64) | optional | Approximate number of points in the collection |
| indexed_vectors_count | [uint64](#uint64) | optional | Approximate number of indexed vectors in the collection. |






<a name="qdrant-CollectionInfo-PayloadSchemaEntry"></a>

### CollectionInfo.PayloadSchemaEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [PayloadSchemaInfo](#qdrant-PayloadSchemaInfo) |  |  |






<a name="qdrant-CollectionOperationResponse"></a>

### CollectionOperationResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [bool](#bool) |  | if operation made changes |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-CollectionParams"></a>

### CollectionParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_number | [uint32](#uint32) |  | Number of shards in collection |
| on_disk_payload | [bool](#bool) |  | If true - point&#39;s payload will not be stored in memory |
| vectors_config | [VectorsConfig](#qdrant-VectorsConfig) | optional | Configuration for vectors |
| replication_factor | [uint32](#uint32) | optional | Number of replicas of each shard that network tries to maintain |
| write_consistency_factor | [uint32](#uint32) | optional | How many replicas should apply the operation for us to consider it successful |
| read_fan_out_factor | [uint32](#uint32) | optional | Fan-out every read request to these many additional remote nodes (and return first available response) |
| sharding_method | [ShardingMethod](#qdrant-ShardingMethod) | optional | Sharding method |
| sparse_vectors_config | [SparseVectorConfig](#qdrant-SparseVectorConfig) | optional | Configuration for sparse vectors |






<a name="qdrant-CollectionParamsDiff"></a>

### CollectionParamsDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| replication_factor | [uint32](#uint32) | optional | Number of replicas of each shard that network tries to maintain |
| write_consistency_factor | [uint32](#uint32) | optional | How many replicas should apply the operation for us to consider it successful |
| on_disk_payload | [bool](#bool) | optional | If true - point&#39;s payload will not be stored in memory |
| read_fan_out_factor | [uint32](#uint32) | optional | Fan-out every read request to these many additional remote nodes (and return first available response) |






<a name="qdrant-CreateAlias"></a>

### CreateAlias



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| alias_name | [string](#string) |  | New name of the alias |






<a name="qdrant-CreateCollection"></a>

### CreateCollection



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| hnsw_config | [HnswConfigDiff](#qdrant-HnswConfigDiff) | optional | Configuration of vector index |
| wal_config | [WalConfigDiff](#qdrant-WalConfigDiff) | optional | Configuration of the Write-Ahead-Log |
| optimizers_config | [OptimizersConfigDiff](#qdrant-OptimizersConfigDiff) | optional | Configuration of the optimizers |
| shard_number | [uint32](#uint32) | optional | Number of shards in the collection, default is 1 for standalone, otherwise equal to the number of nodes. Minimum is 1 |
| on_disk_payload | [bool](#bool) | optional | If true - point&#39;s payload will not be stored in memory |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |
| vectors_config | [VectorsConfig](#qdrant-VectorsConfig) | optional | Configuration for vectors |
| replication_factor | [uint32](#uint32) | optional | Number of replicas of each shard that network tries to maintain, default = 1 |
| write_consistency_factor | [uint32](#uint32) | optional | How many replicas should apply the operation for us to consider it successful, default = 1 |
| init_from_collection | [string](#string) | optional | Specify name of the other collection to copy data from |
| quantization_config | [QuantizationConfig](#qdrant-QuantizationConfig) | optional | Quantization configuration of vector |
| sharding_method | [ShardingMethod](#qdrant-ShardingMethod) | optional | Sharding method |
| sparse_vectors_config | [SparseVectorConfig](#qdrant-SparseVectorConfig) | optional | Configuration for sparse vectors |
| strict_mode_config | [StrictModeConfig](#qdrant-StrictModeConfig) | optional | Configuration for strict mode |






<a name="qdrant-CreateShardKey"></a>

### CreateShardKey



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_key | [ShardKey](#qdrant-ShardKey) |  | User-defined shard key |
| shards_number | [uint32](#uint32) | optional | Number of shards to create per shard key |
| replication_factor | [uint32](#uint32) | optional | Number of replicas of each shard to create |
| placement | [uint64](#uint64) | repeated | List of peer ids, allowed to create shards. If empty - all peers are allowed |






<a name="qdrant-CreateShardKeyRequest"></a>

### CreateShardKeyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| request | [CreateShardKey](#qdrant-CreateShardKey) |  | Request to create shard key |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |






<a name="qdrant-CreateShardKeyResponse"></a>

### CreateShardKeyResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [bool](#bool) |  |  |






<a name="qdrant-DatetimeIndexParams"></a>

### DatetimeIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |
| is_principal | [bool](#bool) | optional | If true - use this key to organize storage of the collection data. This option assumes that this key will be used in majority of filtered requests. |






<a name="qdrant-DeleteAlias"></a>

### DeleteAlias



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| alias_name | [string](#string) |  | Name of the alias |






<a name="qdrant-DeleteCollection"></a>

### DeleteCollection



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |






<a name="qdrant-DeleteShardKey"></a>

### DeleteShardKey



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_key | [ShardKey](#qdrant-ShardKey) |  | Shard key to delete |






<a name="qdrant-DeleteShardKeyRequest"></a>

### DeleteShardKeyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| request | [DeleteShardKey](#qdrant-DeleteShardKey) |  | Request to delete shard key |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |






<a name="qdrant-DeleteShardKeyResponse"></a>

### DeleteShardKeyResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [bool](#bool) |  |  |






<a name="qdrant-Disabled"></a>

### Disabled







<a name="qdrant-FloatIndexParams"></a>

### FloatIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |
| is_principal | [bool](#bool) | optional | If true - use this key to organize storage of the collection data. This option assumes that this key will be used in majority of filtered requests. |






<a name="qdrant-GeoIndexParams"></a>

### GeoIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |






<a name="qdrant-GetCollectionInfoRequest"></a>

### GetCollectionInfoRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-GetCollectionInfoResponse"></a>

### GetCollectionInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [CollectionInfo](#qdrant-CollectionInfo) |  |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-HnswConfigDiff"></a>

### HnswConfigDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| m | [uint64](#uint64) | optional | Number of edges per node in the index graph. Larger the value - more accurate the search, more space required. |
| ef_construct | [uint64](#uint64) | optional | Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build the index. |
| full_scan_threshold | [uint64](#uint64) | optional | Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If the payload chunk is smaller than `full_scan_threshold` additional indexing won&#39;t be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1 Kb = 1 vector of size 256 |
| max_indexing_threads | [uint64](#uint64) | optional | Number of parallel threads used for background index building. If 0 - automatically select from 8 to 16. Best to keep between 8 and 16 to prevent likelihood of building broken/inefficient HNSW graphs. On small CPUs, less threads are used. |
| on_disk | [bool](#bool) | optional | Store HNSW index on disk. If set to false, the index will be stored in RAM. |
| payload_m | [uint64](#uint64) | optional | Number of additional payload-aware links per node in the index graph. If not set - regular M parameter will be used. |






<a name="qdrant-IntegerIndexParams"></a>

### IntegerIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| lookup | [bool](#bool) | optional | If true - support direct lookups. |
| range | [bool](#bool) | optional | If true - support ranges filters. |
| is_principal | [bool](#bool) | optional | If true - use this key to organize storage of the collection data. This option assumes that this key will be used in majority of filtered requests. |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |






<a name="qdrant-KeywordIndexParams"></a>

### KeywordIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| is_tenant | [bool](#bool) | optional | If true - used for tenant optimization. |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |






<a name="qdrant-ListAliasesRequest"></a>

### ListAliasesRequest







<a name="qdrant-ListAliasesResponse"></a>

### ListAliasesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| aliases | [AliasDescription](#qdrant-AliasDescription) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-ListCollectionAliasesRequest"></a>

### ListCollectionAliasesRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-ListCollectionsRequest"></a>

### ListCollectionsRequest







<a name="qdrant-ListCollectionsResponse"></a>

### ListCollectionsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collections | [CollectionDescription](#qdrant-CollectionDescription) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-LocalShardInfo"></a>

### LocalShardInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| points_count | [uint64](#uint64) |  | Number of points in the shard |
| state | [ReplicaState](#qdrant-ReplicaState) |  | Is replica active |
| shard_key | [ShardKey](#qdrant-ShardKey) | optional | User-defined shard key |






<a name="qdrant-MoveShard"></a>

### MoveShard



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| to_shard_id | [uint32](#uint32) | optional |  |
| from_peer_id | [uint64](#uint64) |  |  |
| to_peer_id | [uint64](#uint64) |  |  |
| method | [ShardTransferMethod](#qdrant-ShardTransferMethod) | optional |  |






<a name="qdrant-MultiVectorConfig"></a>

### MultiVectorConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| comparator | [MultiVectorComparator](#qdrant-MultiVectorComparator) |  | Comparator for multi-vector search |






<a name="qdrant-OptimizerStatus"></a>

### OptimizerStatus



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ok | [bool](#bool) |  |  |
| error | [string](#string) |  |  |






<a name="qdrant-OptimizersConfigDiff"></a>

### OptimizersConfigDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| deleted_threshold | [double](#double) | optional | The minimal fraction of deleted vectors in a segment, required to perform segment optimization |
| vacuum_min_vector_number | [uint64](#uint64) | optional | The minimal number of vectors in a segment, required to perform segment optimization |
| default_segment_number | [uint64](#uint64) | optional | Target amount of segments the optimizer will try to keep. Real amount of segments may vary depending on multiple parameters:

- Amount of stored points. - Current write RPS.

It is recommended to select the default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads. |
| max_segment_size | [uint64](#uint64) | optional | Do not create segments larger this size (in kilobytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.

If indexing speed is more important - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256 If not set, will be automatically selected considering the number of available CPUs. |
| memmap_threshold | [uint64](#uint64) | optional | Maximum size (in kilobytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmapped file.

Memmap storage is disabled by default, to enable it, set this threshold to a reasonable value.

To disable memmap storage, set this to `0`.

Note: 1Kb = 1 vector of size 256 |
| indexing_threshold | [uint64](#uint64) | optional | Maximum size (in kilobytes) of vectors allowed for plain index, exceeding this threshold will enable vector indexing

Default value is 20,000, based on &lt;https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md&gt;.

To disable vector indexing, set to `0`.

Note: 1kB = 1 vector of size 256. |
| flush_interval_sec | [uint64](#uint64) | optional | Interval between forced flushes. |
| max_optimization_threads | [uint64](#uint64) | optional | Max number of threads (jobs) for running optimizations per shard. Note: each optimization job will also use `max_indexing_threads` threads by itself for index building. If null - have no limit and choose dynamically to saturate CPU. If 0 - no optimization threads, optimizations will be disabled. |






<a name="qdrant-PayloadIndexParams"></a>

### PayloadIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| keyword_index_params | [KeywordIndexParams](#qdrant-KeywordIndexParams) |  | Parameters for keyword index |
| integer_index_params | [IntegerIndexParams](#qdrant-IntegerIndexParams) |  | Parameters for integer index |
| float_index_params | [FloatIndexParams](#qdrant-FloatIndexParams) |  | Parameters for float index |
| geo_index_params | [GeoIndexParams](#qdrant-GeoIndexParams) |  | Parameters for geo index |
| text_index_params | [TextIndexParams](#qdrant-TextIndexParams) |  | Parameters for text index |
| bool_index_params | [BoolIndexParams](#qdrant-BoolIndexParams) |  | Parameters for bool index |
| datetime_index_params | [DatetimeIndexParams](#qdrant-DatetimeIndexParams) |  | Parameters for datetime index |
| uuid_index_params | [UuidIndexParams](#qdrant-UuidIndexParams) |  | Parameters for uuid index |






<a name="qdrant-PayloadSchemaInfo"></a>

### PayloadSchemaInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data_type | [PayloadSchemaType](#qdrant-PayloadSchemaType) |  | Field data type |
| params | [PayloadIndexParams](#qdrant-PayloadIndexParams) | optional | Field index parameters |
| points | [uint64](#uint64) | optional | Number of points indexed within this field indexed |






<a name="qdrant-ProductQuantization"></a>

### ProductQuantization



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| compression | [CompressionRatio](#qdrant-CompressionRatio) |  | Compression ratio |
| always_ram | [bool](#bool) | optional | If true - quantized vectors always will be stored in RAM, ignoring the config of main storage |






<a name="qdrant-QuantizationConfig"></a>

### QuantizationConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| scalar | [ScalarQuantization](#qdrant-ScalarQuantization) |  |  |
| product | [ProductQuantization](#qdrant-ProductQuantization) |  |  |
| binary | [BinaryQuantization](#qdrant-BinaryQuantization) |  |  |






<a name="qdrant-QuantizationConfigDiff"></a>

### QuantizationConfigDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| scalar | [ScalarQuantization](#qdrant-ScalarQuantization) |  |  |
| product | [ProductQuantization](#qdrant-ProductQuantization) |  |  |
| disabled | [Disabled](#qdrant-Disabled) |  |  |
| binary | [BinaryQuantization](#qdrant-BinaryQuantization) |  |  |






<a name="qdrant-RemoteShardInfo"></a>

### RemoteShardInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| peer_id | [uint64](#uint64) |  | Remote peer id |
| state | [ReplicaState](#qdrant-ReplicaState) |  | Is replica active |
| shard_key | [ShardKey](#qdrant-ShardKey) | optional | User-defined shard key |






<a name="qdrant-RenameAlias"></a>

### RenameAlias



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| old_alias_name | [string](#string) |  | Name of the alias to rename |
| new_alias_name | [string](#string) |  | Name of the alias |






<a name="qdrant-Replica"></a>

### Replica



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  |  |
| peer_id | [uint64](#uint64) |  |  |






<a name="qdrant-ReplicateShard"></a>

### ReplicateShard



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| to_shard_id | [uint32](#uint32) | optional |  |
| from_peer_id | [uint64](#uint64) |  |  |
| to_peer_id | [uint64](#uint64) |  |  |
| method | [ShardTransferMethod](#qdrant-ShardTransferMethod) | optional |  |






<a name="qdrant-ReshardingInfo"></a>

### ReshardingInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  |  |
| peer_id | [uint64](#uint64) |  |  |
| shard_key | [ShardKey](#qdrant-ShardKey) | optional |  |






<a name="qdrant-RestartTransfer"></a>

### RestartTransfer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| to_shard_id | [uint32](#uint32) | optional |  |
| from_peer_id | [uint64](#uint64) |  |  |
| to_peer_id | [uint64](#uint64) |  |  |
| method | [ShardTransferMethod](#qdrant-ShardTransferMethod) |  |  |






<a name="qdrant-ScalarQuantization"></a>

### ScalarQuantization



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [QuantizationType](#qdrant-QuantizationType) |  | Type of quantization |
| quantile | [float](#float) | optional | Number of bits to use for quantization |
| always_ram | [bool](#bool) | optional | If true - quantized vectors always will be stored in RAM, ignoring the config of main storage |






<a name="qdrant-ShardKey"></a>

### ShardKey



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| keyword | [string](#string) |  | String key |
| number | [uint64](#uint64) |  | Number key |






<a name="qdrant-ShardTransferInfo"></a>

### ShardTransferInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_id | [uint32](#uint32) |  | Local shard id |
| to_shard_id | [uint32](#uint32) | optional |  |
| from | [uint64](#uint64) |  |  |
| to | [uint64](#uint64) |  |  |
| sync | [bool](#bool) |  | If `true` transfer is a synchronization of a replicas; If `false` transfer is a moving of a shard from one peer to another |






<a name="qdrant-SparseIndexConfig"></a>

### SparseIndexConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| full_scan_threshold | [uint64](#uint64) | optional | Prefer a full scan search upto (excluding) this number of vectors. Note: this is number of vectors, not KiloBytes. |
| on_disk | [bool](#bool) | optional | Store inverted index on disk. If set to false, the index will be stored in RAM. |
| datatype | [Datatype](#qdrant-Datatype) | optional | Datatype used to store weights in the index. |






<a name="qdrant-SparseVectorConfig"></a>

### SparseVectorConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| map | [SparseVectorConfig.MapEntry](#qdrant-SparseVectorConfig-MapEntry) | repeated |  |






<a name="qdrant-SparseVectorConfig-MapEntry"></a>

### SparseVectorConfig.MapEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [SparseVectorParams](#qdrant-SparseVectorParams) |  |  |






<a name="qdrant-SparseVectorParams"></a>

### SparseVectorParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| index | [SparseIndexConfig](#qdrant-SparseIndexConfig) | optional | Configuration of sparse index |
| modifier | [Modifier](#qdrant-Modifier) | optional | If set - apply modifier to the vector values |






<a name="qdrant-StrictModeConfig"></a>

### StrictModeConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| enabled | [bool](#bool) | optional |  |
| max_query_limit | [uint32](#uint32) | optional |  |
| max_timeout | [uint32](#uint32) | optional |  |
| unindexed_filtering_retrieve | [bool](#bool) | optional |  |
| unindexed_filtering_update | [bool](#bool) | optional |  |
| search_max_hnsw_ef | [uint32](#uint32) | optional |  |
| search_allow_exact | [bool](#bool) | optional |  |
| search_max_oversampling | [float](#float) | optional |  |
| upsert_max_batchsize | [uint64](#uint64) | optional |  |
| max_collection_vector_size_bytes | [uint64](#uint64) | optional |  |
| read_rate_limit_per_sec | [uint32](#uint32) | optional |  |
| write_rate_limit_per_sec | [uint32](#uint32) | optional |  |






<a name="qdrant-TextIndexParams"></a>

### TextIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| tokenizer | [TokenizerType](#qdrant-TokenizerType) |  | Tokenizer type |
| lowercase | [bool](#bool) | optional | If true - all tokens will be lowercase |
| min_token_len | [uint64](#uint64) | optional | Minimal token length |
| max_token_len | [uint64](#uint64) | optional | Maximal token length |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |






<a name="qdrant-UpdateCollection"></a>

### UpdateCollection



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| optimizers_config | [OptimizersConfigDiff](#qdrant-OptimizersConfigDiff) | optional | New configuration parameters for the collection. This operation is blocking, it will only proceed once all current optimizations are complete |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds if blocking, if not specified - default value will be supplied |
| params | [CollectionParamsDiff](#qdrant-CollectionParamsDiff) | optional | New configuration parameters for the collection |
| hnsw_config | [HnswConfigDiff](#qdrant-HnswConfigDiff) | optional | New HNSW parameters for the collection index |
| vectors_config | [VectorsConfigDiff](#qdrant-VectorsConfigDiff) | optional | New vector parameters |
| quantization_config | [QuantizationConfigDiff](#qdrant-QuantizationConfigDiff) | optional | Quantization configuration of vector |
| sparse_vectors_config | [SparseVectorConfig](#qdrant-SparseVectorConfig) | optional | New sparse vector parameters |
| strict_mode_config | [StrictModeConfig](#qdrant-StrictModeConfig) | optional | New strict mode configuration |






<a name="qdrant-UpdateCollectionClusterSetupRequest"></a>

### UpdateCollectionClusterSetupRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| move_shard | [MoveShard](#qdrant-MoveShard) |  |  |
| replicate_shard | [ReplicateShard](#qdrant-ReplicateShard) |  |  |
| abort_transfer | [AbortShardTransfer](#qdrant-AbortShardTransfer) |  |  |
| drop_replica | [Replica](#qdrant-Replica) |  |  |
| create_shard_key | [CreateShardKey](#qdrant-CreateShardKey) |  |  |
| delete_shard_key | [DeleteShardKey](#qdrant-DeleteShardKey) |  |  |
| restart_transfer | [RestartTransfer](#qdrant-RestartTransfer) |  |  |
| timeout | [uint64](#uint64) | optional | Wait timeout for operation commit in seconds, if not specified - default value will be supplied |






<a name="qdrant-UpdateCollectionClusterSetupResponse"></a>

### UpdateCollectionClusterSetupResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [bool](#bool) |  |  |






<a name="qdrant-UuidIndexParams"></a>

### UuidIndexParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| is_tenant | [bool](#bool) | optional | If true - used for tenant optimization. |
| on_disk | [bool](#bool) | optional | If true - store index on disk. |






<a name="qdrant-VectorParams"></a>

### VectorParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| size | [uint64](#uint64) |  | Size of the vectors |
| distance | [Distance](#qdrant-Distance) |  | Distance function used for comparing vectors |
| hnsw_config | [HnswConfigDiff](#qdrant-HnswConfigDiff) | optional | Configuration of vector HNSW graph. If omitted - the collection configuration will be used |
| quantization_config | [QuantizationConfig](#qdrant-QuantizationConfig) | optional | Configuration of vector quantization config. If omitted - the collection configuration will be used |
| on_disk | [bool](#bool) | optional | If true - serve vectors from disk. If set to false, the vectors will be loaded in RAM. |
| datatype | [Datatype](#qdrant-Datatype) | optional | Data type of the vectors |
| multivector_config | [MultiVectorConfig](#qdrant-MultiVectorConfig) | optional | Configuration for multi-vector search |






<a name="qdrant-VectorParamsDiff"></a>

### VectorParamsDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hnsw_config | [HnswConfigDiff](#qdrant-HnswConfigDiff) | optional | Update params for HNSW index. If empty object - it will be unset |
| quantization_config | [QuantizationConfigDiff](#qdrant-QuantizationConfigDiff) | optional | Update quantization params. If none - it is left unchanged. |
| on_disk | [bool](#bool) | optional | If true - serve vectors from disk. If set to false, the vectors will be loaded in RAM. |






<a name="qdrant-VectorParamsDiffMap"></a>

### VectorParamsDiffMap



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| map | [VectorParamsDiffMap.MapEntry](#qdrant-VectorParamsDiffMap-MapEntry) | repeated |  |






<a name="qdrant-VectorParamsDiffMap-MapEntry"></a>

### VectorParamsDiffMap.MapEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [VectorParamsDiff](#qdrant-VectorParamsDiff) |  |  |






<a name="qdrant-VectorParamsMap"></a>

### VectorParamsMap



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| map | [VectorParamsMap.MapEntry](#qdrant-VectorParamsMap-MapEntry) | repeated |  |






<a name="qdrant-VectorParamsMap-MapEntry"></a>

### VectorParamsMap.MapEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [VectorParams](#qdrant-VectorParams) |  |  |






<a name="qdrant-VectorsConfig"></a>

### VectorsConfig



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| params | [VectorParams](#qdrant-VectorParams) |  |  |
| params_map | [VectorParamsMap](#qdrant-VectorParamsMap) |  |  |






<a name="qdrant-VectorsConfigDiff"></a>

### VectorsConfigDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| params | [VectorParamsDiff](#qdrant-VectorParamsDiff) |  |  |
| params_map | [VectorParamsDiffMap](#qdrant-VectorParamsDiffMap) |  |  |






<a name="qdrant-WalConfigDiff"></a>

### WalConfigDiff



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| wal_capacity_mb | [uint64](#uint64) | optional | Size of a single WAL block file |
| wal_segments_ahead | [uint64](#uint64) | optional | Number of segments to create in advance |








<a name="qdrant-CollectionStatus"></a>

### CollectionStatus


| Name | Number | Description |
| ---- | ------ | ----------- |
| UnknownCollectionStatus | 0 |  |
| Green | 1 | All segments are ready |
| Yellow | 2 | Optimization in process |
| Red | 3 | Something went wrong |
| Grey | 4 | Optimization is pending |



<a name="qdrant-CompressionRatio"></a>

### CompressionRatio


| Name | Number | Description |
| ---- | ------ | ----------- |
| x4 | 0 |  |
| x8 | 1 |  |
| x16 | 2 |  |
| x32 | 3 |  |
| x64 | 4 |  |



<a name="qdrant-Datatype"></a>

### Datatype


| Name | Number | Description |
| ---- | ------ | ----------- |
| Default | 0 |  |
| Float32 | 1 |  |
| Uint8 | 2 |  |
| Float16 | 3 |  |



<a name="qdrant-Distance"></a>

### Distance


| Name | Number | Description |
| ---- | ------ | ----------- |
| UnknownDistance | 0 |  |
| Cosine | 1 |  |
| Euclid | 2 |  |
| Dot | 3 |  |
| Manhattan | 4 |  |



<a name="qdrant-Modifier"></a>

### Modifier


| Name | Number | Description |
| ---- | ------ | ----------- |
| None | 0 |  |
| Idf | 1 | Apply Inverse Document Frequency |



<a name="qdrant-MultiVectorComparator"></a>

### MultiVectorComparator


| Name | Number | Description |
| ---- | ------ | ----------- |
| MaxSim | 0 |  |



<a name="qdrant-PayloadSchemaType"></a>

### PayloadSchemaType


| Name | Number | Description |
| ---- | ------ | ----------- |
| UnknownType | 0 |  |
| Keyword | 1 |  |
| Integer | 2 |  |
| Float | 3 |  |
| Geo | 4 |  |
| Text | 5 |  |
| Bool | 6 |  |
| Datetime | 7 |  |
| Uuid | 8 |  |



<a name="qdrant-QuantizationType"></a>

### QuantizationType


| Name | Number | Description |
| ---- | ------ | ----------- |
| UnknownQuantization | 0 |  |
| Int8 | 1 |  |



<a name="qdrant-ReplicaState"></a>

### ReplicaState


| Name | Number | Description |
| ---- | ------ | ----------- |
| Active | 0 | Active and sound |
| Dead | 1 | Failed for some reason |
| Partial | 2 | The shard is partially loaded and is currently receiving data from other shards |
| Initializing | 3 | Collection is being created |
| Listener | 4 | A shard which receives data, but is not used for search; Useful for backup shards |
| PartialSnapshot | 5 | Deprecated: snapshot shard transfer is in progress; Updates should not be sent to (and are ignored by) the shard |
| Recovery | 6 | Shard is undergoing recovered by an external node; Normally rejects updates, accepts updates if force is true |
| Resharding | 7 | Points are being migrated to this shard as part of resharding |



<a name="qdrant-ShardTransferMethod"></a>

### ShardTransferMethod


| Name | Number | Description |
| ---- | ------ | ----------- |
| StreamRecords | 0 | Stream shard records in batches |
| Snapshot | 1 | Snapshot the shard and recover it on the target peer |
| WalDelta | 2 | Resolve WAL delta between peers and transfer the difference |
| ReshardingStreamRecords | 3 | Stream shard records in batches for resharding |



<a name="qdrant-ShardingMethod"></a>

### ShardingMethod


| Name | Number | Description |
| ---- | ------ | ----------- |
| Auto | 0 | Auto-sharding based on record ids |
| Custom | 1 | Shard by user-defined key |



<a name="qdrant-TokenizerType"></a>

### TokenizerType


| Name | Number | Description |
| ---- | ------ | ----------- |
| Unknown | 0 |  |
| Prefix | 1 |  |
| Whitespace | 2 |  |
| Word | 3 |  |
| Multilingual | 4 |  |










<a name="collections_service-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## collections_service.proto









<a name="qdrant-Collections"></a>

### Collections


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Get | [GetCollectionInfoRequest](#qdrant-GetCollectionInfoRequest) | [GetCollectionInfoResponse](#qdrant-GetCollectionInfoResponse) | Get detailed information about specified existing collection |
| List | [ListCollectionsRequest](#qdrant-ListCollectionsRequest) | [ListCollectionsResponse](#qdrant-ListCollectionsResponse) | Get list name of all existing collections |
| Create | [CreateCollection](#qdrant-CreateCollection) | [CollectionOperationResponse](#qdrant-CollectionOperationResponse) | Create new collection with given parameters |
| Update | [UpdateCollection](#qdrant-UpdateCollection) | [CollectionOperationResponse](#qdrant-CollectionOperationResponse) | Update parameters of the existing collection |
| Delete | [DeleteCollection](#qdrant-DeleteCollection) | [CollectionOperationResponse](#qdrant-CollectionOperationResponse) | Drop collection and all associated data |
| UpdateAliases | [ChangeAliases](#qdrant-ChangeAliases) | [CollectionOperationResponse](#qdrant-CollectionOperationResponse) | Update Aliases of the existing collection |
| ListCollectionAliases | [ListCollectionAliasesRequest](#qdrant-ListCollectionAliasesRequest) | [ListAliasesResponse](#qdrant-ListAliasesResponse) | Get list of all aliases for a collection |
| ListAliases | [ListAliasesRequest](#qdrant-ListAliasesRequest) | [ListAliasesResponse](#qdrant-ListAliasesResponse) | Get list of all aliases for all existing collections |
| CollectionClusterInfo | [CollectionClusterInfoRequest](#qdrant-CollectionClusterInfoRequest) | [CollectionClusterInfoResponse](#qdrant-CollectionClusterInfoResponse) | Get cluster information for a collection |
| CollectionExists | [CollectionExistsRequest](#qdrant-CollectionExistsRequest) | [CollectionExistsResponse](#qdrant-CollectionExistsResponse) | Check the existence of a collection |
| UpdateCollectionClusterSetup | [UpdateCollectionClusterSetupRequest](#qdrant-UpdateCollectionClusterSetupRequest) | [UpdateCollectionClusterSetupResponse](#qdrant-UpdateCollectionClusterSetupResponse) | Update cluster setup for a collection |
| CreateShardKey | [CreateShardKeyRequest](#qdrant-CreateShardKeyRequest) | [CreateShardKeyResponse](#qdrant-CreateShardKeyResponse) | Create shard key |
| DeleteShardKey | [DeleteShardKeyRequest](#qdrant-DeleteShardKeyRequest) | [DeleteShardKeyResponse](#qdrant-DeleteShardKeyResponse) | Delete shard key |





<a name="health_check-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## health_check.proto
source: https://github.com/grpc/grpc/blob/master/doc/health-checking.md#service-definition


<a name="grpc-health-v1-HealthCheckRequest"></a>

### HealthCheckRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| service | [string](#string) |  |  |






<a name="grpc-health-v1-HealthCheckResponse"></a>

### HealthCheckResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [HealthCheckResponse.ServingStatus](#grpc-health-v1-HealthCheckResponse-ServingStatus) |  |  |








<a name="grpc-health-v1-HealthCheckResponse-ServingStatus"></a>

### HealthCheckResponse.ServingStatus


| Name | Number | Description |
| ---- | ------ | ----------- |
| UNKNOWN | 0 |  |
| SERVING | 1 |  |
| NOT_SERVING | 2 |  |
| SERVICE_UNKNOWN | 3 | Used only by the Watch method. |







<a name="grpc-health-v1-Health"></a>

### Health


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Check | [HealthCheckRequest](#grpc-health-v1-HealthCheckRequest) | [HealthCheckResponse](#grpc-health-v1-HealthCheckResponse) |  |





<a name="json_with_int-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## json_with_int.proto



<a name="qdrant-ListValue"></a>

### ListValue
`ListValue` is a wrapper around a repeated field of values.

The JSON representation for `ListValue` is a JSON array.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Value](#qdrant-Value) | repeated | Repeated field of dynamically typed values. |






<a name="qdrant-Struct"></a>

### Struct
`Struct` represents a structured data value, consisting of fields
which map to dynamically typed values. In some languages, `Struct`
might be supported by a native representation. For example, in
scripting languages like JS a struct is represented as an
object. The details of that representation are described together
with the proto support for the language.

The JSON representation for `Struct` is a JSON object.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| fields | [Struct.FieldsEntry](#qdrant-Struct-FieldsEntry) | repeated | Unordered map of dynamically typed values. |






<a name="qdrant-Struct-FieldsEntry"></a>

### Struct.FieldsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-Value"></a>

### Value
`Value` represents a dynamically typed value which can be either
null, a number, a string, a boolean, a recursive struct value, or a
list of values. A producer of value is expected to set one of those
variants, absence of any variant indicates an error.

The JSON representation for `Value` is a JSON value.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| null_value | [NullValue](#qdrant-NullValue) |  | Represents a null value. |
| double_value | [double](#double) |  | Represents a double value. |
| integer_value | [int64](#int64) |  | Represents an integer value |
| string_value | [string](#string) |  | Represents a string value. |
| bool_value | [bool](#bool) |  | Represents a boolean value. |
| struct_value | [Struct](#qdrant-Struct) |  | Represents a structured value. |
| list_value | [ListValue](#qdrant-ListValue) |  | Represents a repeated `Value`. |








<a name="qdrant-NullValue"></a>

### NullValue
`NullValue` is a singleton enumeration to represent the null value for the
`Value` type union.

 The JSON representation for `NullValue` is JSON `null`.

| Name | Number | Description |
| ---- | ------ | ----------- |
| NULL_VALUE | 0 | Null value. |










<a name="points-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## points.proto



<a name="qdrant-BatchResult"></a>

### BatchResult



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [ScoredPoint](#qdrant-ScoredPoint) | repeated |  |






<a name="qdrant-ClearPayloadPoints"></a>

### ClearPayloadPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| points | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-Condition"></a>

### Condition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| field | [FieldCondition](#qdrant-FieldCondition) |  |  |
| is_empty | [IsEmptyCondition](#qdrant-IsEmptyCondition) |  |  |
| has_id | [HasIdCondition](#qdrant-HasIdCondition) |  |  |
| filter | [Filter](#qdrant-Filter) |  |  |
| is_null | [IsNullCondition](#qdrant-IsNullCondition) |  |  |
| nested | [NestedCondition](#qdrant-NestedCondition) |  |  |
| has_vector | [HasVectorCondition](#qdrant-HasVectorCondition) |  |  |






<a name="qdrant-ContextExamplePair"></a>

### ContextExamplePair



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| positive | [VectorExample](#qdrant-VectorExample) |  |  |
| negative | [VectorExample](#qdrant-VectorExample) |  |  |






<a name="qdrant-ContextInput"></a>

### ContextInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [ContextInputPair](#qdrant-ContextInputPair) | repeated | Search space will be constrained by these pairs of vectors |






<a name="qdrant-ContextInputPair"></a>

### ContextInputPair



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| positive | [VectorInput](#qdrant-VectorInput) |  | A positive vector |
| negative | [VectorInput](#qdrant-VectorInput) |  | Repel from this vector |






<a name="qdrant-CountPoints"></a>

### CountPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| exact | [bool](#bool) | optional | If `true` - return exact count, if `false` - return approximate count |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-CountResponse"></a>

### CountResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [CountResult](#qdrant-CountResult) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-CountResult"></a>

### CountResult



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| count | [uint64](#uint64) |  |  |






<a name="qdrant-CreateFieldIndexCollection"></a>

### CreateFieldIndexCollection



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| field_name | [string](#string) |  | Field name to index |
| field_type | [FieldType](#qdrant-FieldType) | optional | Field type. |
| field_index_params | [PayloadIndexParams](#qdrant-PayloadIndexParams) | optional | Payload index params. |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |






<a name="qdrant-DatetimeRange"></a>

### DatetimeRange



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| lt | [google.protobuf.Timestamp](#google-protobuf-Timestamp) | optional |  |
| gt | [google.protobuf.Timestamp](#google-protobuf-Timestamp) | optional |  |
| gte | [google.protobuf.Timestamp](#google-protobuf-Timestamp) | optional |  |
| lte | [google.protobuf.Timestamp](#google-protobuf-Timestamp) | optional |  |






<a name="qdrant-DeleteFieldIndexCollection"></a>

### DeleteFieldIndexCollection



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| field_name | [string](#string) |  | Field name to delete |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |






<a name="qdrant-DeletePayloadPoints"></a>

### DeletePayloadPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| keys | [string](#string) | repeated | List of keys to delete |
| points_selector | [PointsSelector](#qdrant-PointsSelector) | optional | Affected points |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-DeletePointVectors"></a>

### DeletePointVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| points_selector | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| vectors | [VectorsSelector](#qdrant-VectorsSelector) |  | List of vector names to delete |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-DeletePoints"></a>

### DeletePoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| points | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-DenseVector"></a>

### DenseVector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [float](#float) | repeated |  |






<a name="qdrant-DiscoverBatchPoints"></a>

### DiscoverBatchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| discover_points | [DiscoverPoints](#qdrant-DiscoverPoints) | repeated |  |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-DiscoverBatchResponse"></a>

### DiscoverBatchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [BatchResult](#qdrant-BatchResult) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-DiscoverInput"></a>

### DiscoverInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| target | [VectorInput](#qdrant-VectorInput) |  | Use this as the primary search objective |
| context | [ContextInput](#qdrant-ContextInput) |  | Search space will be constrained by these pairs of vectors |






<a name="qdrant-DiscoverPoints"></a>

### DiscoverPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| target | [TargetVector](#qdrant-TargetVector) |  | Use this as the primary search objective |
| context | [ContextExamplePair](#qdrant-ContextExamplePair) | repeated | Search will be constrained by these pairs of examples |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| limit | [uint64](#uint64) |  | Max number of result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| params | [SearchParams](#qdrant-SearchParams) |  | Search config |
| offset | [uint64](#uint64) | optional | Offset of the result |
| using | [string](#string) | optional | Define which vector to use for recommendation, if not specified - default vector |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | Name of the collection to use for points lookup, if not specified - use current collection |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-DiscoverResponse"></a>

### DiscoverResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [ScoredPoint](#qdrant-ScoredPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-Document"></a>

### Document



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| text | [string](#string) |  | Text of the document |
| model | [string](#string) |  | Model name |
| options | [Document.OptionsEntry](#qdrant-Document-OptionsEntry) | repeated | Model options |






<a name="qdrant-Document-OptionsEntry"></a>

### Document.OptionsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-FacetCounts"></a>

### FacetCounts



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| key | [string](#string) |  | Payload key of the facet |
| filter | [Filter](#qdrant-Filter) | optional | Filter conditions - return only those points that satisfy the specified conditions. |
| limit | [uint64](#uint64) | optional | Max number of facets. Default is 10. |
| exact | [bool](#bool) | optional | If true, return exact counts, slower but useful for debugging purposes. Default is false. |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-FacetHit"></a>

### FacetHit



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| value | [FacetValue](#qdrant-FacetValue) |  | Value from the facet |
| count | [uint64](#uint64) |  | Number of points with this value |






<a name="qdrant-FacetResponse"></a>

### FacetResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hits | [FacetHit](#qdrant-FacetHit) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-FacetValue"></a>

### FacetValue



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| string_value | [string](#string) |  | String value from the facet |
| integer_value | [int64](#int64) |  | Integer value from the facet |
| bool_value | [bool](#bool) |  | Boolean value from the facet |






<a name="qdrant-FieldCondition"></a>

### FieldCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| match | [Match](#qdrant-Match) |  | Check if point has field with a given value |
| range | [Range](#qdrant-Range) |  | Check if points value lies in a given range |
| geo_bounding_box | [GeoBoundingBox](#qdrant-GeoBoundingBox) |  | Check if points geolocation lies in a given area |
| geo_radius | [GeoRadius](#qdrant-GeoRadius) |  | Check if geo point is within a given radius |
| values_count | [ValuesCount](#qdrant-ValuesCount) |  | Check number of values for a specific field |
| geo_polygon | [GeoPolygon](#qdrant-GeoPolygon) |  | Check if geo point is within a given polygon |
| datetime_range | [DatetimeRange](#qdrant-DatetimeRange) |  | Check if datetime is within a given range |






<a name="qdrant-Filter"></a>

### Filter



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| should | [Condition](#qdrant-Condition) | repeated | At least one of those conditions should match |
| must | [Condition](#qdrant-Condition) | repeated | All conditions must match |
| must_not | [Condition](#qdrant-Condition) | repeated | All conditions must NOT match |
| min_should | [MinShould](#qdrant-MinShould) | optional | At least minimum amount of given conditions should match |






<a name="qdrant-GeoBoundingBox"></a>

### GeoBoundingBox



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| top_left | [GeoPoint](#qdrant-GeoPoint) |  | north-west corner |
| bottom_right | [GeoPoint](#qdrant-GeoPoint) |  | south-east corner |






<a name="qdrant-GeoLineString"></a>

### GeoLineString



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [GeoPoint](#qdrant-GeoPoint) | repeated | Ordered sequence of GeoPoints representing the line |






<a name="qdrant-GeoPoint"></a>

### GeoPoint



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| lon | [double](#double) |  |  |
| lat | [double](#double) |  |  |






<a name="qdrant-GeoPolygon"></a>

### GeoPolygon
For a valid GeoPolygon, both the exterior and interior GeoLineStrings must consist of a minimum of 4 points.
Additionally, the first and last points of each GeoLineString must be the same.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| exterior | [GeoLineString](#qdrant-GeoLineString) |  | The exterior line bounds the surface |
| interiors | [GeoLineString](#qdrant-GeoLineString) | repeated | Interior lines (if present) bound holes within the surface |






<a name="qdrant-GeoRadius"></a>

### GeoRadius



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| center | [GeoPoint](#qdrant-GeoPoint) |  | Center of the circle |
| radius | [float](#float) |  | In meters |






<a name="qdrant-GetPoints"></a>

### GetPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| ids | [PointId](#qdrant-PointId) | repeated | List of points to retrieve |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-GetResponse"></a>

### GetResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [RetrievedPoint](#qdrant-RetrievedPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-GroupId"></a>

### GroupId



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| unsigned_value | [uint64](#uint64) |  | Represents a double value. |
| integer_value | [int64](#int64) |  | Represents an integer value |
| string_value | [string](#string) |  | Represents a string value. |






<a name="qdrant-GroupsResult"></a>

### GroupsResult



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| groups | [PointGroup](#qdrant-PointGroup) | repeated | Groups |






<a name="qdrant-HardwareUsage"></a>

### HardwareUsage



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| cpu | [uint64](#uint64) |  |  |






<a name="qdrant-HasIdCondition"></a>

### HasIdCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| has_id | [PointId](#qdrant-PointId) | repeated |  |






<a name="qdrant-HasVectorCondition"></a>

### HasVectorCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| has_vector | [string](#string) |  |  |






<a name="qdrant-Image"></a>

### Image



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| image | [Value](#qdrant-Value) |  | Image data, either base64 encoded or URL |
| model | [string](#string) |  | Model name |
| options | [Image.OptionsEntry](#qdrant-Image-OptionsEntry) | repeated | Model options |






<a name="qdrant-Image-OptionsEntry"></a>

### Image.OptionsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-InferenceObject"></a>

### InferenceObject



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| object | [Value](#qdrant-Value) |  | Object to infer |
| model | [string](#string) |  | Model name |
| options | [InferenceObject.OptionsEntry](#qdrant-InferenceObject-OptionsEntry) | repeated | Model options |






<a name="qdrant-InferenceObject-OptionsEntry"></a>

### InferenceObject.OptionsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-IsEmptyCondition"></a>

### IsEmptyCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |






<a name="qdrant-IsNullCondition"></a>

### IsNullCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |






<a name="qdrant-LookupLocation"></a>

### LookupLocation



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  |  |
| vector_name | [string](#string) | optional | Which vector to use for search, if not specified - use default vector |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-Match"></a>

### Match



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| keyword | [string](#string) |  | Match string keyword |
| integer | [int64](#int64) |  | Match integer |
| boolean | [bool](#bool) |  | Match boolean |
| text | [string](#string) |  | Match text |
| keywords | [RepeatedStrings](#qdrant-RepeatedStrings) |  | Match multiple keywords |
| integers | [RepeatedIntegers](#qdrant-RepeatedIntegers) |  | Match multiple integers |
| except_integers | [RepeatedIntegers](#qdrant-RepeatedIntegers) |  | Match any other value except those integers |
| except_keywords | [RepeatedStrings](#qdrant-RepeatedStrings) |  | Match any other value except those keywords |






<a name="qdrant-MinShould"></a>

### MinShould



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| conditions | [Condition](#qdrant-Condition) | repeated |  |
| min_count | [uint64](#uint64) |  |  |






<a name="qdrant-MultiDenseVector"></a>

### MultiDenseVector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vectors | [DenseVector](#qdrant-DenseVector) | repeated |  |






<a name="qdrant-NamedVectors"></a>

### NamedVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vectors | [NamedVectors.VectorsEntry](#qdrant-NamedVectors-VectorsEntry) | repeated |  |






<a name="qdrant-NamedVectors-VectorsEntry"></a>

### NamedVectors.VectorsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Vector](#qdrant-Vector) |  |  |






<a name="qdrant-NamedVectorsOutput"></a>

### NamedVectorsOutput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vectors | [NamedVectorsOutput.VectorsEntry](#qdrant-NamedVectorsOutput-VectorsEntry) | repeated |  |






<a name="qdrant-NamedVectorsOutput-VectorsEntry"></a>

### NamedVectorsOutput.VectorsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [VectorOutput](#qdrant-VectorOutput) |  |  |






<a name="qdrant-NestedCondition"></a>

### NestedCondition



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  | Path to nested object |
| filter | [Filter](#qdrant-Filter) |  | Filter condition |






<a name="qdrant-OrderBy"></a>

### OrderBy



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  | Payload key to order by |
| direction | [Direction](#qdrant-Direction) | optional | Ascending or descending order |
| start_from | [StartFrom](#qdrant-StartFrom) | optional | Start from this value |






<a name="qdrant-OrderValue"></a>

### OrderValue



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| int | [int64](#int64) |  |  |
| float | [double](#double) |  |  |






<a name="qdrant-PayloadExcludeSelector"></a>

### PayloadExcludeSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| fields | [string](#string) | repeated | List of payload keys to exclude from the result |






<a name="qdrant-PayloadIncludeSelector"></a>

### PayloadIncludeSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| fields | [string](#string) | repeated | List of payload keys to include into result |






<a name="qdrant-PointGroup"></a>

### PointGroup



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [GroupId](#qdrant-GroupId) |  | Group id |
| hits | [ScoredPoint](#qdrant-ScoredPoint) | repeated | Points in the group |
| lookup | [RetrievedPoint](#qdrant-RetrievedPoint) |  | Point(s) from the lookup collection that matches the group id |






<a name="qdrant-PointId"></a>

### PointId



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num | [uint64](#uint64) |  | Numerical ID of the point |
| uuid | [string](#string) |  | UUID |






<a name="qdrant-PointStruct"></a>

### PointStruct



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  |  |
| payload | [PointStruct.PayloadEntry](#qdrant-PointStruct-PayloadEntry) | repeated |  |
| vectors | [Vectors](#qdrant-Vectors) | optional |  |






<a name="qdrant-PointStruct-PayloadEntry"></a>

### PointStruct.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-PointVectors"></a>

### PointVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  | ID to update vectors for |
| vectors | [Vectors](#qdrant-Vectors) |  | Named vectors to update, leave others intact |






<a name="qdrant-PointsIdsList"></a>

### PointsIdsList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ids | [PointId](#qdrant-PointId) | repeated |  |






<a name="qdrant-PointsOperationResponse"></a>

### PointsOperationResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [UpdateResult](#qdrant-UpdateResult) |  |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-PointsSelector"></a>

### PointsSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [PointsIdsList](#qdrant-PointsIdsList) |  |  |
| filter | [Filter](#qdrant-Filter) |  |  |






<a name="qdrant-PointsUpdateOperation"></a>

### PointsUpdateOperation



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| upsert | [PointsUpdateOperation.PointStructList](#qdrant-PointsUpdateOperation-PointStructList) |  |  |
| delete_deprecated | [PointsSelector](#qdrant-PointsSelector) |  | **Deprecated.**  |
| set_payload | [PointsUpdateOperation.SetPayload](#qdrant-PointsUpdateOperation-SetPayload) |  |  |
| overwrite_payload | [PointsUpdateOperation.OverwritePayload](#qdrant-PointsUpdateOperation-OverwritePayload) |  |  |
| delete_payload | [PointsUpdateOperation.DeletePayload](#qdrant-PointsUpdateOperation-DeletePayload) |  |  |
| clear_payload_deprecated | [PointsSelector](#qdrant-PointsSelector) |  | **Deprecated.**  |
| update_vectors | [PointsUpdateOperation.UpdateVectors](#qdrant-PointsUpdateOperation-UpdateVectors) |  |  |
| delete_vectors | [PointsUpdateOperation.DeleteVectors](#qdrant-PointsUpdateOperation-DeleteVectors) |  |  |
| delete_points | [PointsUpdateOperation.DeletePoints](#qdrant-PointsUpdateOperation-DeletePoints) |  |  |
| clear_payload | [PointsUpdateOperation.ClearPayload](#qdrant-PointsUpdateOperation-ClearPayload) |  |  |






<a name="qdrant-PointsUpdateOperation-ClearPayload"></a>

### PointsUpdateOperation.ClearPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PointsUpdateOperation-DeletePayload"></a>

### PointsUpdateOperation.DeletePayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| keys | [string](#string) | repeated |  |
| points_selector | [PointsSelector](#qdrant-PointsSelector) | optional | Affected points |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PointsUpdateOperation-DeletePoints"></a>

### PointsUpdateOperation.DeletePoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PointsUpdateOperation-DeleteVectors"></a>

### PointsUpdateOperation.DeleteVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points_selector | [PointsSelector](#qdrant-PointsSelector) |  | Affected points |
| vectors | [VectorsSelector](#qdrant-VectorsSelector) |  | List of vector names to delete |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PointsUpdateOperation-OverwritePayload"></a>

### PointsUpdateOperation.OverwritePayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| payload | [PointsUpdateOperation.OverwritePayload.PayloadEntry](#qdrant-PointsUpdateOperation-OverwritePayload-PayloadEntry) | repeated |  |
| points_selector | [PointsSelector](#qdrant-PointsSelector) | optional | Affected points |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |
| key | [string](#string) | optional | Option for indicate property of payload |






<a name="qdrant-PointsUpdateOperation-OverwritePayload-PayloadEntry"></a>

### PointsUpdateOperation.OverwritePayload.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-PointsUpdateOperation-PointStructList"></a>

### PointsUpdateOperation.PointStructList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [PointStruct](#qdrant-PointStruct) | repeated |  |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PointsUpdateOperation-SetPayload"></a>

### PointsUpdateOperation.SetPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| payload | [PointsUpdateOperation.SetPayload.PayloadEntry](#qdrant-PointsUpdateOperation-SetPayload-PayloadEntry) | repeated |  |
| points_selector | [PointsSelector](#qdrant-PointsSelector) | optional | Affected points |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |
| key | [string](#string) | optional | Option for indicate property of payload |






<a name="qdrant-PointsUpdateOperation-SetPayload-PayloadEntry"></a>

### PointsUpdateOperation.SetPayload.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-PointsUpdateOperation-UpdateVectors"></a>

### PointsUpdateOperation.UpdateVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| points | [PointVectors](#qdrant-PointVectors) | repeated | List of points and vectors to update |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-PrefetchQuery"></a>

### PrefetchQuery



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| prefetch | [PrefetchQuery](#qdrant-PrefetchQuery) | repeated | Sub-requests to perform first. If present, the query will be performed on the results of the prefetches. |
| query | [Query](#qdrant-Query) | optional | Query to perform. If missing, returns points ordered by their IDs. |
| using | [string](#string) | optional | Define which vector to use for querying. If missing, the default vector is is used. |
| filter | [Filter](#qdrant-Filter) | optional | Filter conditions - return only those points that satisfy the specified conditions. |
| params | [SearchParams](#qdrant-SearchParams) | optional | Search params for when there is no prefetch. |
| score_threshold | [float](#float) | optional | Return points with scores better than this threshold. |
| limit | [uint64](#uint64) | optional | Max number of points. Default is 10 |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | The location to use for IDs lookup, if not specified - use the current collection and the &#39;using&#39; vector |






<a name="qdrant-QuantizationSearchParams"></a>

### QuantizationSearchParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ignore | [bool](#bool) | optional | If set to true, search will ignore quantized vector data |
| rescore | [bool](#bool) | optional | If true, use original vectors to re-score top-k results. If ignored, qdrant decides automatically does rescore enabled or not. |
| oversampling | [double](#double) | optional | Oversampling factor for quantization.

Defines how many extra vectors should be pre-selected using quantized index, and then re-scored using original vectors.

For example, if `oversampling` is 2.4 and `limit` is 100, then 240 vectors will be pre-selected using quantized index, and then top-100 will be returned after re-scoring. |






<a name="qdrant-Query"></a>

### Query



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| nearest | [VectorInput](#qdrant-VectorInput) |  | Find the nearest neighbors to this vector. |
| recommend | [RecommendInput](#qdrant-RecommendInput) |  | Use multiple positive and negative vectors to find the results. |
| discover | [DiscoverInput](#qdrant-DiscoverInput) |  | Search for nearest points, but constrain the search space with context |
| context | [ContextInput](#qdrant-ContextInput) |  | Return points that live in positive areas. |
| order_by | [OrderBy](#qdrant-OrderBy) |  | Order the points by a payload field. |
| fusion | [Fusion](#qdrant-Fusion) |  | Fuse the results of multiple prefetches. |
| sample | [Sample](#qdrant-Sample) |  | Sample points from the collection. |






<a name="qdrant-QueryBatchPoints"></a>

### QueryBatchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  |  |
| query_points | [QueryPoints](#qdrant-QueryPoints) | repeated |  |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-QueryBatchResponse"></a>

### QueryBatchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [BatchResult](#qdrant-BatchResult) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-QueryGroupsResponse"></a>

### QueryGroupsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [GroupsResult](#qdrant-GroupsResult) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-QueryPointGroups"></a>

### QueryPointGroups



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| prefetch | [PrefetchQuery](#qdrant-PrefetchQuery) | repeated | Sub-requests to perform first. If present, the query will be performed on the results of the prefetches. |
| query | [Query](#qdrant-Query) | optional | Query to perform. If missing, returns points ordered by their IDs. |
| using | [string](#string) | optional | Define which vector to use for querying. If missing, the default vector is used. |
| filter | [Filter](#qdrant-Filter) | optional | Filter conditions - return only those points that satisfy the specified conditions. |
| params | [SearchParams](#qdrant-SearchParams) | optional | Search params for when there is no prefetch. |
| score_threshold | [float](#float) | optional | Return points with scores better than this threshold. |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | The location to use for IDs lookup, if not specified - use the current collection and the &#39;using&#39; vector |
| limit | [uint64](#uint64) | optional | Max number of points. Default is 3. |
| group_size | [uint64](#uint64) | optional | Maximum amount of points to return per group. Default to 10. |
| group_by | [string](#string) |  | Payload field to group by, must be a string or number field. If there are multiple values for the field, all of them will be used. One point can be in multiple groups. |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| with_lookup | [WithLookup](#qdrant-WithLookup) | optional | Options for specifying how to use the group id to lookup points in another collection |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-QueryPoints"></a>

### QueryPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| prefetch | [PrefetchQuery](#qdrant-PrefetchQuery) | repeated | Sub-requests to perform first. If present, the query will be performed on the results of the prefetches. |
| query | [Query](#qdrant-Query) | optional | Query to perform. If missing, returns points ordered by their IDs. |
| using | [string](#string) | optional | Define which vector to use for querying. If missing, the default vector is used. |
| filter | [Filter](#qdrant-Filter) | optional | Filter conditions - return only those points that satisfy the specified conditions. |
| params | [SearchParams](#qdrant-SearchParams) | optional | Search params for when there is no prefetch. |
| score_threshold | [float](#float) | optional | Return points with scores better than this threshold. |
| limit | [uint64](#uint64) | optional | Max number of points. Default is 10. |
| offset | [uint64](#uint64) | optional | Offset of the result. Skip this many points. Default is 0. |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into the response. |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) | optional | Options for specifying which payload to include or not. |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards. |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | The location to use for IDs lookup, if not specified - use the current collection and the &#39;using&#39; vector |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-QueryResponse"></a>

### QueryResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [ScoredPoint](#qdrant-ScoredPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-Range"></a>

### Range



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| lt | [double](#double) | optional |  |
| gt | [double](#double) | optional |  |
| gte | [double](#double) | optional |  |
| lte | [double](#double) | optional |  |






<a name="qdrant-ReadConsistency"></a>

### ReadConsistency



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [ReadConsistencyType](#qdrant-ReadConsistencyType) |  | Common read consistency configurations |
| factor | [uint64](#uint64) |  | Send request to a specified number of nodes, and return points which are present on all of them |






<a name="qdrant-RecommendBatchPoints"></a>

### RecommendBatchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| recommend_points | [RecommendPoints](#qdrant-RecommendPoints) | repeated |  |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-RecommendBatchResponse"></a>

### RecommendBatchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [BatchResult](#qdrant-BatchResult) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-RecommendGroupsResponse"></a>

### RecommendGroupsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [GroupsResult](#qdrant-GroupsResult) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-RecommendInput"></a>

### RecommendInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| positive | [VectorInput](#qdrant-VectorInput) | repeated | Look for vectors closest to the vectors from these points |
| negative | [VectorInput](#qdrant-VectorInput) | repeated | Try to avoid vectors like the vector from these points |
| strategy | [RecommendStrategy](#qdrant-RecommendStrategy) | optional | How to use the provided vectors to find the results |






<a name="qdrant-RecommendPointGroups"></a>

### RecommendPointGroups



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| positive | [PointId](#qdrant-PointId) | repeated | Look for vectors closest to the vectors from these points |
| negative | [PointId](#qdrant-PointId) | repeated | Try to avoid vectors like the vector from these points |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| limit | [uint32](#uint32) |  | Max number of groups in result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| params | [SearchParams](#qdrant-SearchParams) |  | Search config |
| score_threshold | [float](#float) | optional | If provided - cut off results with worse scores |
| using | [string](#string) | optional | Define which vector to use for recommendation, if not specified - default vector |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | Name of the collection to use for points lookup, if not specified - use current collection |
| group_by | [string](#string) |  | Payload field to group by, must be a string or number field. If there are multiple values for the field, all of them will be used. One point can be in multiple groups. |
| group_size | [uint32](#uint32) |  | Maximum amount of points to return per group |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| with_lookup | [WithLookup](#qdrant-WithLookup) | optional | Options for specifying how to use the group id to lookup points in another collection |
| strategy | [RecommendStrategy](#qdrant-RecommendStrategy) | optional | How to use the example vectors to find the results |
| positive_vectors | [Vector](#qdrant-Vector) | repeated | Look for vectors closest to those |
| negative_vectors | [Vector](#qdrant-Vector) | repeated | Try to avoid vectors like this |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-RecommendPoints"></a>

### RecommendPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| positive | [PointId](#qdrant-PointId) | repeated | Look for vectors closest to the vectors from these points |
| negative | [PointId](#qdrant-PointId) | repeated | Try to avoid vectors like the vector from these points |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| limit | [uint64](#uint64) |  | Max number of result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| params | [SearchParams](#qdrant-SearchParams) |  | Search config |
| score_threshold | [float](#float) | optional | If provided - cut off results with worse scores |
| offset | [uint64](#uint64) | optional | Offset of the result |
| using | [string](#string) | optional | Define which vector to use for recommendation, if not specified - default vector |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| lookup_from | [LookupLocation](#qdrant-LookupLocation) | optional | Name of the collection to use for points lookup, if not specified - use current collection |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| strategy | [RecommendStrategy](#qdrant-RecommendStrategy) | optional | How to use the example vectors to find the results |
| positive_vectors | [Vector](#qdrant-Vector) | repeated | Look for vectors closest to those |
| negative_vectors | [Vector](#qdrant-Vector) | repeated | Try to avoid vectors like this |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-RecommendResponse"></a>

### RecommendResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [ScoredPoint](#qdrant-ScoredPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-RepeatedIntegers"></a>

### RepeatedIntegers



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| integers | [int64](#int64) | repeated |  |






<a name="qdrant-RepeatedStrings"></a>

### RepeatedStrings



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| strings | [string](#string) | repeated |  |






<a name="qdrant-RetrievedPoint"></a>

### RetrievedPoint



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  |  |
| payload | [RetrievedPoint.PayloadEntry](#qdrant-RetrievedPoint-PayloadEntry) | repeated |  |
| vectors | [VectorsOutput](#qdrant-VectorsOutput) | optional |  |
| shard_key | [ShardKey](#qdrant-ShardKey) | optional | Shard key |
| order_value | [OrderValue](#qdrant-OrderValue) | optional | Order-by value |






<a name="qdrant-RetrievedPoint-PayloadEntry"></a>

### RetrievedPoint.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-ScoredPoint"></a>

### ScoredPoint



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  | Point id |
| payload | [ScoredPoint.PayloadEntry](#qdrant-ScoredPoint-PayloadEntry) | repeated | Payload |
| score | [float](#float) |  | Similarity score |
| version | [uint64](#uint64) |  | Last update operation applied to this point |
| vectors | [VectorsOutput](#qdrant-VectorsOutput) | optional | Vectors to search |
| shard_key | [ShardKey](#qdrant-ShardKey) | optional | Shard key |
| order_value | [OrderValue](#qdrant-OrderValue) | optional | Order by value |






<a name="qdrant-ScoredPoint-PayloadEntry"></a>

### ScoredPoint.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-ScrollPoints"></a>

### ScrollPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  |  |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| offset | [PointId](#qdrant-PointId) | optional | Start with this ID |
| limit | [uint32](#uint32) | optional | Max number of result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |
| order_by | [OrderBy](#qdrant-OrderBy) | optional | Order the records by a payload field |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-ScrollResponse"></a>

### ScrollResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| next_page_offset | [PointId](#qdrant-PointId) | optional | Use this offset for the next query |
| result | [RetrievedPoint](#qdrant-RetrievedPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-SearchBatchPoints"></a>

### SearchBatchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| search_points | [SearchPoints](#qdrant-SearchPoints) | repeated |  |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |






<a name="qdrant-SearchBatchResponse"></a>

### SearchBatchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [BatchResult](#qdrant-BatchResult) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-SearchGroupsResponse"></a>

### SearchGroupsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [GroupsResult](#qdrant-GroupsResult) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-SearchMatrixOffsets"></a>

### SearchMatrixOffsets



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| offsets_row | [uint64](#uint64) | repeated | Row indices of the matrix |
| offsets_col | [uint64](#uint64) | repeated | Column indices of the matrix |
| scores | [float](#float) | repeated | Scores associated with matrix coordinates |
| ids | [PointId](#qdrant-PointId) | repeated | Ids of the points in order |






<a name="qdrant-SearchMatrixOffsetsResponse"></a>

### SearchMatrixOffsetsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [SearchMatrixOffsets](#qdrant-SearchMatrixOffsets) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-SearchMatrixPair"></a>

### SearchMatrixPair



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| a | [PointId](#qdrant-PointId) |  | first id of the pair |
| b | [PointId](#qdrant-PointId) |  | second id of the pair |
| score | [float](#float) |  | score of the pair |






<a name="qdrant-SearchMatrixPairs"></a>

### SearchMatrixPairs



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [SearchMatrixPair](#qdrant-SearchMatrixPair) | repeated | List of pairs of points with scores |






<a name="qdrant-SearchMatrixPairsResponse"></a>

### SearchMatrixPairsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [SearchMatrixPairs](#qdrant-SearchMatrixPairs) |  |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-SearchMatrixPoints"></a>

### SearchMatrixPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| filter | [Filter](#qdrant-Filter) | optional | Filter conditions - return only those points that satisfy the specified conditions. |
| sample | [uint64](#uint64) | optional | How many points to select and search within. Default is 10. |
| limit | [uint64](#uint64) | optional | How many neighbours per sample to find. Default is 3. |
| using | [string](#string) | optional | Define which vector to use for querying. If missing, the default vector is is used. |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |






<a name="qdrant-SearchParams"></a>

### SearchParams



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hnsw_ef | [uint64](#uint64) | optional | Params relevant to HNSW index. Size of the beam in a beam-search. Larger the value - more accurate the result, more time required for search. |
| exact | [bool](#bool) | optional | Search without approximation. If set to true, search may run long but with exact results. |
| quantization | [QuantizationSearchParams](#qdrant-QuantizationSearchParams) | optional | If set to true, search will ignore quantized vector data |
| indexed_only | [bool](#bool) | optional | If enabled, the engine will only perform search among indexed or small segments. Using this option prevents slow searches in case of delayed index, but does not guarantee that all uploaded vectors will be included in search results |






<a name="qdrant-SearchPointGroups"></a>

### SearchPointGroups



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| vector | [float](#float) | repeated | Vector to compare against |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| limit | [uint32](#uint32) |  | Max number of result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| params | [SearchParams](#qdrant-SearchParams) |  | Search config |
| score_threshold | [float](#float) | optional | If provided - cut off results with worse scores |
| vector_name | [string](#string) | optional | Which vector to use for search, if not specified - use default vector |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| group_by | [string](#string) |  | Payload field to group by, must be a string or number field. If there are multiple values for the field, all of them will be used. One point can be in multiple groups. |
| group_size | [uint32](#uint32) |  | Maximum amount of points to return per group |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| with_lookup | [WithLookup](#qdrant-WithLookup) | optional | Options for specifying how to use the group id to lookup points in another collection |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |
| sparse_indices | [SparseIndices](#qdrant-SparseIndices) | optional |  |






<a name="qdrant-SearchPoints"></a>

### SearchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| vector | [float](#float) | repeated | vector |
| filter | [Filter](#qdrant-Filter) |  | Filter conditions - return only those points that satisfy the specified conditions |
| limit | [uint64](#uint64) |  | Max number of result |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) |  | Options for specifying which payload to include or not |
| params | [SearchParams](#qdrant-SearchParams) |  | Search config |
| score_threshold | [float](#float) | optional | If provided - cut off results with worse scores |
| offset | [uint64](#uint64) | optional | Offset of the result |
| vector_name | [string](#string) | optional | Which vector to use for search, if not specified - use default vector |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include into response |
| read_consistency | [ReadConsistency](#qdrant-ReadConsistency) | optional | Options for specifying read consistency guarantees |
| timeout | [uint64](#uint64) | optional | If set, overrides global timeout setting for this request. Unit is seconds. |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Specify in which shards to look for the points, if not specified - look in all shards |
| sparse_indices | [SparseIndices](#qdrant-SparseIndices) | optional |  |






<a name="qdrant-SearchResponse"></a>

### SearchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [ScoredPoint](#qdrant-ScoredPoint) | repeated |  |
| time | [double](#double) |  | Time spent to process |
| usage | [HardwareUsage](#qdrant-HardwareUsage) | optional |  |






<a name="qdrant-SetPayloadPoints"></a>

### SetPayloadPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| payload | [SetPayloadPoints.PayloadEntry](#qdrant-SetPayloadPoints-PayloadEntry) | repeated | New payload values |
| points_selector | [PointsSelector](#qdrant-PointsSelector) | optional | Affected points |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |
| key | [string](#string) | optional | Option for indicate property of payload |






<a name="qdrant-SetPayloadPoints-PayloadEntry"></a>

### SetPayloadPoints.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Value](#qdrant-Value) |  |  |






<a name="qdrant-ShardKeySelector"></a>

### ShardKeySelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| shard_keys | [ShardKey](#qdrant-ShardKey) | repeated | List of shard keys which should be used in the request |






<a name="qdrant-SparseIndices"></a>

### SparseIndices



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [uint32](#uint32) | repeated |  |






<a name="qdrant-SparseVector"></a>

### SparseVector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [float](#float) | repeated |  |
| indices | [uint32](#uint32) | repeated |  |






<a name="qdrant-StartFrom"></a>

### StartFrom



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| float | [double](#double) |  |  |
| integer | [int64](#int64) |  |  |
| timestamp | [google.protobuf.Timestamp](#google-protobuf-Timestamp) |  |  |
| datetime | [string](#string) |  |  |






<a name="qdrant-TargetVector"></a>

### TargetVector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| single | [VectorExample](#qdrant-VectorExample) |  |  |






<a name="qdrant-UpdateBatchPoints"></a>

### UpdateBatchPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| operations | [PointsUpdateOperation](#qdrant-PointsUpdateOperation) | repeated |  |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |






<a name="qdrant-UpdateBatchResponse"></a>

### UpdateBatchResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [UpdateResult](#qdrant-UpdateResult) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-UpdatePointVectors"></a>

### UpdatePointVectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| points | [PointVectors](#qdrant-PointVectors) | repeated | List of points and vectors to update |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-UpdateResult"></a>

### UpdateResult



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| operation_id | [uint64](#uint64) | optional | Number of operation |
| status | [UpdateStatus](#qdrant-UpdateStatus) |  | Operation status |






<a name="qdrant-UpsertPoints"></a>

### UpsertPoints



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | name of the collection |
| wait | [bool](#bool) | optional | Wait until the changes have been applied? |
| points | [PointStruct](#qdrant-PointStruct) | repeated |  |
| ordering | [WriteOrdering](#qdrant-WriteOrdering) | optional | Write ordering guarantees |
| shard_key_selector | [ShardKeySelector](#qdrant-ShardKeySelector) | optional | Option for custom sharding to specify used shard keys |






<a name="qdrant-ValuesCount"></a>

### ValuesCount



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| lt | [uint64](#uint64) | optional |  |
| gt | [uint64](#uint64) | optional |  |
| gte | [uint64](#uint64) | optional |  |
| lte | [uint64](#uint64) | optional |  |






<a name="qdrant-Vector"></a>

### Vector
Legacy vector format, which determines the vector type by the configuration of its fields.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [float](#float) | repeated | Vector data (flatten for multi vectors), deprecated |
| indices | [SparseIndices](#qdrant-SparseIndices) | optional | Sparse indices for sparse vectors, deprecated |
| vectors_count | [uint32](#uint32) | optional | Number of vectors per multi vector, deprecated |
| dense | [DenseVector](#qdrant-DenseVector) |  | Dense vector |
| sparse | [SparseVector](#qdrant-SparseVector) |  | Sparse vector |
| multi_dense | [MultiDenseVector](#qdrant-MultiDenseVector) |  | Multi dense vector |
| document | [Document](#qdrant-Document) |  |  |
| image | [Image](#qdrant-Image) |  |  |
| object | [InferenceObject](#qdrant-InferenceObject) |  |  |






<a name="qdrant-VectorExample"></a>

### VectorExample



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  |  |
| vector | [Vector](#qdrant-Vector) |  |  |






<a name="qdrant-VectorInput"></a>

### VectorInput
Vector type to be used in queries. Ids will be substituted with their corresponding vectors from the collection.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [PointId](#qdrant-PointId) |  |  |
| dense | [DenseVector](#qdrant-DenseVector) |  |  |
| sparse | [SparseVector](#qdrant-SparseVector) |  |  |
| multi_dense | [MultiDenseVector](#qdrant-MultiDenseVector) |  |  |
| document | [Document](#qdrant-Document) |  |  |
| image | [Image](#qdrant-Image) |  |  |
| object | [InferenceObject](#qdrant-InferenceObject) |  |  |






<a name="qdrant-VectorOutput"></a>

### VectorOutput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [float](#float) | repeated | Vector data (flatten for multi vectors), deprecated |
| indices | [SparseIndices](#qdrant-SparseIndices) | optional | Sparse indices for sparse vectors, deprecated |
| vectors_count | [uint32](#uint32) | optional | Number of vectors per multi vector, deprecated |
| dense | [DenseVector](#qdrant-DenseVector) |  | Dense vector |
| sparse | [SparseVector](#qdrant-SparseVector) |  | Sparse vector |
| multi_dense | [MultiDenseVector](#qdrant-MultiDenseVector) |  | Multi dense vector |






<a name="qdrant-Vectors"></a>

### Vectors



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vector | [Vector](#qdrant-Vector) |  |  |
| vectors | [NamedVectors](#qdrant-NamedVectors) |  |  |






<a name="qdrant-VectorsOutput"></a>

### VectorsOutput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vector | [VectorOutput](#qdrant-VectorOutput) |  |  |
| vectors | [NamedVectorsOutput](#qdrant-NamedVectorsOutput) |  |  |






<a name="qdrant-VectorsSelector"></a>

### VectorsSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| names | [string](#string) | repeated | List of vectors to include into result |






<a name="qdrant-WithLookup"></a>

### WithLookup



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection | [string](#string) |  | Name of the collection to use for points lookup |
| with_payload | [WithPayloadSelector](#qdrant-WithPayloadSelector) | optional | Options for specifying which payload to include (or not) |
| with_vectors | [WithVectorsSelector](#qdrant-WithVectorsSelector) | optional | Options for specifying which vectors to include (or not) |






<a name="qdrant-WithPayloadSelector"></a>

### WithPayloadSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| enable | [bool](#bool) |  | If `true` - return all payload, if `false` - none |
| include | [PayloadIncludeSelector](#qdrant-PayloadIncludeSelector) |  |  |
| exclude | [PayloadExcludeSelector](#qdrant-PayloadExcludeSelector) |  |  |






<a name="qdrant-WithVectorsSelector"></a>

### WithVectorsSelector



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| enable | [bool](#bool) |  | If `true` - return all vectors, if `false` - none |
| include | [VectorsSelector](#qdrant-VectorsSelector) |  | List of payload keys to include into result |






<a name="qdrant-WriteOrdering"></a>

### WriteOrdering



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [WriteOrderingType](#qdrant-WriteOrderingType) |  | Write ordering guarantees |








<a name="qdrant-Direction"></a>

### Direction


| Name | Number | Description |
| ---- | ------ | ----------- |
| Asc | 0 |  |
| Desc | 1 |  |



<a name="qdrant-FieldType"></a>

### FieldType


| Name | Number | Description |
| ---- | ------ | ----------- |
| FieldTypeKeyword | 0 |  |
| FieldTypeInteger | 1 |  |
| FieldTypeFloat | 2 |  |
| FieldTypeGeo | 3 |  |
| FieldTypeText | 4 |  |
| FieldTypeBool | 5 |  |
| FieldTypeDatetime | 6 |  |
| FieldTypeUuid | 7 |  |



<a name="qdrant-Fusion"></a>

### Fusion


| Name | Number | Description |
| ---- | ------ | ----------- |
| RRF | 0 | Reciprocal Rank Fusion |
| DBSF | 1 | Distribution-Based Score Fusion |



<a name="qdrant-ReadConsistencyType"></a>

### ReadConsistencyType


| Name | Number | Description |
| ---- | ------ | ----------- |
| All | 0 | Send request to all nodes and return points which are present on all of them |
| Majority | 1 | Send requests to all nodes and return points which are present on majority of them |
| Quorum | 2 | Send requests to half &#43; 1 nodes, return points which are present on all of them |



<a name="qdrant-RecommendStrategy"></a>

### RecommendStrategy
How to use positive and negative vectors to find the results, default is `AverageVector`.

| Name | Number | Description |
| ---- | ------ | ----------- |
| AverageVector | 0 | Average positive and negative vectors and create a single query with the formula `query = avg_pos &#43; avg_pos - avg_neg`. Then performs normal search. |
| BestScore | 1 | Uses custom search objective. Each candidate is compared against all examples, its score is then chosen from the `max(max_pos_score, max_neg_score)`. If the `max_neg_score` is chosen then it is squared and negated. |



<a name="qdrant-Sample"></a>

### Sample
Sample points from the collection

Available sampling methods:

* `random` - Random sampling

| Name | Number | Description |
| ---- | ------ | ----------- |
| Random | 0 |  |



<a name="qdrant-UpdateStatus"></a>

### UpdateStatus


| Name | Number | Description |
| ---- | ------ | ----------- |
| UnknownUpdateStatus | 0 |  |
| Acknowledged | 1 | Update is received, but not processed yet |
| Completed | 2 | Update is applied and ready for search |
| ClockRejected | 3 | Internal: update is rejected due to an outdated clock |



<a name="qdrant-WriteOrderingType"></a>

### WriteOrderingType


| Name | Number | Description |
| ---- | ------ | ----------- |
| Weak | 0 | Write operations may be reordered, works faster, default |
| Medium | 1 | Write operations go through dynamically selected leader, may be inconsistent for a short period of time in case of leader change |
| Strong | 2 | Write operations go through the permanent leader, consistent, but may be unavailable if leader is down |










<a name="points_service-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## points_service.proto









<a name="qdrant-Points"></a>

### Points


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Upsert | [UpsertPoints](#qdrant-UpsertPoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Perform insert &#43; updates on points. If a point with a given ID already exists - it will be overwritten. |
| Delete | [DeletePoints](#qdrant-DeletePoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Delete points |
| Get | [GetPoints](#qdrant-GetPoints) | [GetResponse](#qdrant-GetResponse) | Retrieve points |
| UpdateVectors | [UpdatePointVectors](#qdrant-UpdatePointVectors) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Update named vectors for point |
| DeleteVectors | [DeletePointVectors](#qdrant-DeletePointVectors) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Delete named vectors for points |
| SetPayload | [SetPayloadPoints](#qdrant-SetPayloadPoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Set payload for points |
| OverwritePayload | [SetPayloadPoints](#qdrant-SetPayloadPoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Overwrite payload for points |
| DeletePayload | [DeletePayloadPoints](#qdrant-DeletePayloadPoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Delete specified key payload for points |
| ClearPayload | [ClearPayloadPoints](#qdrant-ClearPayloadPoints) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Remove all payload for specified points |
| CreateFieldIndex | [CreateFieldIndexCollection](#qdrant-CreateFieldIndexCollection) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Create index for field in collection |
| DeleteFieldIndex | [DeleteFieldIndexCollection](#qdrant-DeleteFieldIndexCollection) | [PointsOperationResponse](#qdrant-PointsOperationResponse) | Delete field index for collection |
| Search | [SearchPoints](#qdrant-SearchPoints) | [SearchResponse](#qdrant-SearchResponse) | Retrieve closest points based on vector similarity and given filtering conditions |
| SearchBatch | [SearchBatchPoints](#qdrant-SearchBatchPoints) | [SearchBatchResponse](#qdrant-SearchBatchResponse) | Retrieve closest points based on vector similarity and given filtering conditions |
| SearchGroups | [SearchPointGroups](#qdrant-SearchPointGroups) | [SearchGroupsResponse](#qdrant-SearchGroupsResponse) | Retrieve closest points based on vector similarity and given filtering conditions, grouped by a given field |
| Scroll | [ScrollPoints](#qdrant-ScrollPoints) | [ScrollResponse](#qdrant-ScrollResponse) | Iterate over all or filtered points |
| Recommend | [RecommendPoints](#qdrant-RecommendPoints) | [RecommendResponse](#qdrant-RecommendResponse) | Look for the points which are closer to stored positive examples and at the same time further to negative examples. |
| RecommendBatch | [RecommendBatchPoints](#qdrant-RecommendBatchPoints) | [RecommendBatchResponse](#qdrant-RecommendBatchResponse) | Look for the points which are closer to stored positive examples and at the same time further to negative examples. |
| RecommendGroups | [RecommendPointGroups](#qdrant-RecommendPointGroups) | [RecommendGroupsResponse](#qdrant-RecommendGroupsResponse) | Look for the points which are closer to stored positive examples and at the same time further to negative examples, grouped by a given field |
| Discover | [DiscoverPoints](#qdrant-DiscoverPoints) | [DiscoverResponse](#qdrant-DiscoverResponse) | Use context and a target to find the most similar points to the target, constrained by the context.

When using only the context (without a target), a special search - called context search - is performed where pairs of points are used to generate a loss that guides the search towards the zone where most positive examples overlap. This means that the score minimizes the scenario of finding a point closer to a negative than to a positive part of a pair.

Since the score of a context relates to loss, the maximum score a point can get is 0.0, and it becomes normal that many points can have a score of 0.0.

When using target (with or without context), the score behaves a little different: The integer part of the score represents the rank with respect to the context, while the decimal part of the score relates to the distance to the target. The context part of the score for each pair is calculated &#43;1 if the point is closer to a positive than to a negative part of a pair, and -1 otherwise. |
| DiscoverBatch | [DiscoverBatchPoints](#qdrant-DiscoverBatchPoints) | [DiscoverBatchResponse](#qdrant-DiscoverBatchResponse) | Batch request points based on { positive, negative } pairs of examples, and/or a target |
| Count | [CountPoints](#qdrant-CountPoints) | [CountResponse](#qdrant-CountResponse) | Count points in collection with given filtering conditions |
| UpdateBatch | [UpdateBatchPoints](#qdrant-UpdateBatchPoints) | [UpdateBatchResponse](#qdrant-UpdateBatchResponse) | Perform multiple update operations in one request |
| Query | [QueryPoints](#qdrant-QueryPoints) | [QueryResponse](#qdrant-QueryResponse) | Universally query points. This endpoint covers all capabilities of search, recommend, discover, filters. But also enables hybrid and multi-stage queries. |
| QueryBatch | [QueryBatchPoints](#qdrant-QueryBatchPoints) | [QueryBatchResponse](#qdrant-QueryBatchResponse) | Universally query points in a batch fashion. This endpoint covers all capabilities of search, recommend, discover, filters. But also enables hybrid and multi-stage queries. |
| QueryGroups | [QueryPointGroups](#qdrant-QueryPointGroups) | [QueryGroupsResponse](#qdrant-QueryGroupsResponse) | Universally query points in a group fashion. This endpoint covers all capabilities of search, recommend, discover, filters. But also enables hybrid and multi-stage queries. |
| Facet | [FacetCounts](#qdrant-FacetCounts) | [FacetResponse](#qdrant-FacetResponse) | Perform facet counts. For each value in the field, count the number of points that have this value and match the conditions. |
| SearchMatrixPairs | [SearchMatrixPoints](#qdrant-SearchMatrixPoints) | [SearchMatrixPairsResponse](#qdrant-SearchMatrixPairsResponse) | Compute distance matrix for sampled points with a pair based output format |
| SearchMatrixOffsets | [SearchMatrixPoints](#qdrant-SearchMatrixPoints) | [SearchMatrixOffsetsResponse](#qdrant-SearchMatrixOffsetsResponse) | Compute distance matrix for sampled points with an offset based output format |





<a name="qdrant-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## qdrant.proto



<a name="qdrant-HealthCheckReply"></a>

### HealthCheckReply



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| title | [string](#string) |  |  |
| version | [string](#string) |  |  |
| commit | [string](#string) | optional |  |






<a name="qdrant-HealthCheckRequest"></a>

### HealthCheckRequest













<a name="qdrant-Qdrant"></a>

### Qdrant


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| HealthCheck | [HealthCheckRequest](#qdrant-HealthCheckRequest) | [HealthCheckReply](#qdrant-HealthCheckReply) |  |





<a name="qdrant_internal_service-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## qdrant_internal_service.proto



<a name="qdrant-GetConsensusCommitRequest"></a>

### GetConsensusCommitRequest







<a name="qdrant-GetConsensusCommitResponse"></a>

### GetConsensusCommitResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| commit | [int64](#int64) |  | Raft commit as u64 |
| term | [int64](#int64) |  | Raft term as u64 |






<a name="qdrant-WaitOnConsensusCommitRequest"></a>

### WaitOnConsensusCommitRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| commit | [int64](#int64) |  | Raft commit as u64 |
| term | [int64](#int64) |  | Raft term as u64 |
| timeout | [int64](#int64) |  | Timeout in seconds |






<a name="qdrant-WaitOnConsensusCommitResponse"></a>

### WaitOnConsensusCommitResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ok | [bool](#bool) |  | False if commit/term is diverged and never reached or if timed out. |












<a name="qdrant-QdrantInternal"></a>

### QdrantInternal


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetConsensusCommit | [GetConsensusCommitRequest](#qdrant-GetConsensusCommitRequest) | [GetConsensusCommitResponse](#qdrant-GetConsensusCommitResponse) | Get current commit and term on the target node. |
| WaitOnConsensusCommit | [WaitOnConsensusCommitRequest](#qdrant-WaitOnConsensusCommitRequest) | [WaitOnConsensusCommitResponse](#qdrant-WaitOnConsensusCommitResponse) | Wait until the target node reached the given commit ID. |





<a name="snapshots_service-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## snapshots_service.proto



<a name="qdrant-CreateFullSnapshotRequest"></a>

### CreateFullSnapshotRequest







<a name="qdrant-CreateSnapshotRequest"></a>

### CreateSnapshotRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-CreateSnapshotResponse"></a>

### CreateSnapshotResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| snapshot_description | [SnapshotDescription](#qdrant-SnapshotDescription) |  |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-DeleteFullSnapshotRequest"></a>

### DeleteFullSnapshotRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| snapshot_name | [string](#string) |  | Name of the full snapshot |






<a name="qdrant-DeleteSnapshotRequest"></a>

### DeleteSnapshotRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |
| snapshot_name | [string](#string) |  | Name of the collection snapshot |






<a name="qdrant-DeleteSnapshotResponse"></a>

### DeleteSnapshotResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-ListFullSnapshotsRequest"></a>

### ListFullSnapshotsRequest







<a name="qdrant-ListSnapshotsRequest"></a>

### ListSnapshotsRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| collection_name | [string](#string) |  | Name of the collection |






<a name="qdrant-ListSnapshotsResponse"></a>

### ListSnapshotsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| snapshot_descriptions | [SnapshotDescription](#qdrant-SnapshotDescription) | repeated |  |
| time | [double](#double) |  | Time spent to process |






<a name="qdrant-SnapshotDescription"></a>

### SnapshotDescription



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  | Name of the snapshot |
| creation_time | [google.protobuf.Timestamp](#google-protobuf-Timestamp) |  | Creation time of the snapshot |
| size | [int64](#int64) |  | Size of the snapshot in bytes |
| checksum | [string](#string) | optional | SHA256 digest of the snapshot file |












<a name="qdrant-Snapshots"></a>

### Snapshots


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [CreateSnapshotRequest](#qdrant-CreateSnapshotRequest) | [CreateSnapshotResponse](#qdrant-CreateSnapshotResponse) | Create collection snapshot |
| List | [ListSnapshotsRequest](#qdrant-ListSnapshotsRequest) | [ListSnapshotsResponse](#qdrant-ListSnapshotsResponse) | List collection snapshots |
| Delete | [DeleteSnapshotRequest](#qdrant-DeleteSnapshotRequest) | [DeleteSnapshotResponse](#qdrant-DeleteSnapshotResponse) | Delete collection snapshot |
| CreateFull | [CreateFullSnapshotRequest](#qdrant-CreateFullSnapshotRequest) | [CreateSnapshotResponse](#qdrant-CreateSnapshotResponse) | Create full storage snapshot |
| ListFull | [ListFullSnapshotsRequest](#qdrant-ListFullSnapshotsRequest) | [ListSnapshotsResponse](#qdrant-ListSnapshotsResponse) | List full storage snapshots |
| DeleteFull | [DeleteFullSnapshotRequest](#qdrant-DeleteFullSnapshotRequest) | [DeleteSnapshotResponse](#qdrant-DeleteSnapshotResponse) | Delete full storage snapshot |





## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |




---
File: /docs/redoc/v0.11.6/openapi.json
---

{
  "paths": {
    "/telemetry": {
      "get": {
        "summary": "Collect telemetry data",
        "description": "Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics",
        "operationId": "telemetry",
        "tags": [
          "service"
        ],
        "parameters": [
          {
            "name": "anonymize",
            "in": "query",
            "description": "If true, anonymize result",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/TelemetryData"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/locks": {
      "post": {
        "summary": "Set lock options",
        "description": "Set lock options. If write is locked, all write operations and collection creation are forbidden. Returns previous lock options",
        "operationId": "post_locks",
        "tags": [
          "service"
        ],
        "requestBody": {
          "description": "Lock options and optional error message",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LocksOption"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/LocksOption"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Get lock options",
        "description": "Get lock options. If write is locked, all write operations and collection creation are forbidden",
        "operationId": "get_locks",
        "tags": [
          "service"
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/LocksOption"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cluster": {
      "get": {
        "tags": [
          "cluster"
        ],
        "summary": "Get cluster status info",
        "description": "Get information about the current state and composition of the cluster",
        "operationId": "cluster_status",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/ClusterStatus"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cluster/peer/{peer_id}": {
      "delete": {
        "tags": [
          "cluster"
        ],
        "summary": "Remove peer from the cluster",
        "description": "Tries to remove peer from the cluster. Will return an error if peer has shards on it.",
        "operationId": "remove_peer",
        "parameters": [
          {
            "name": "peer_id",
            "in": "path",
            "description": "Id of the peer",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "force",
            "in": "query",
            "description": "If true - removes peer even if it has shards/replicas on it.",
            "schema": {
              "type": "boolean",
              "default": false
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections": {
      "get": {
        "tags": [
          "collections"
        ],
        "summary": "List collections",
        "description": "Get list name of all existing collections",
        "operationId": "get_collections",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionsResponse"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}": {
      "get": {
        "tags": [
          "collections"
        ],
        "summary": "Collection info",
        "description": "Get detailed information about specified existing collection",
        "operationId": "get_collection",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionInfo"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "collections"
        ],
        "summary": "Create collection",
        "description": "Create new collection with given parameters",
        "operationId": "create_collection",
        "requestBody": {
          "description": "Parameters of a new collection",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCollection"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the new collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "patch": {
        "tags": [
          "collections"
        ],
        "summary": "Update collection parameters",
        "description": "Update parameters of the existing collection",
        "operationId": "update_collection",
        "requestBody": {
          "description": "New parameters",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCollection"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to update",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "collections"
        ],
        "summary": "Delete collection",
        "description": "Drop collection and all associated data",
        "operationId": "delete_collection",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/aliases": {
      "post": {
        "tags": [
          "collections"
        ],
        "summary": "Update aliases of the collections",
        "operationId": "update_aliases",
        "requestBody": {
          "description": "Alias update operations",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangeAliasesOperation"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/index": {
      "put": {
        "tags": [
          "collections"
        ],
        "summary": "Create index for field in collection",
        "description": "Create index for field in collection",
        "operationId": "create_field_index",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "requestBody": {
          "description": "Field name",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFieldIndex"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/index/{field_name}": {
      "delete": {
        "tags": [
          "collections"
        ],
        "summary": "Delete index for field in collection",
        "description": "Delete field index for collection",
        "operationId": "delete_field_index",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "field_name",
            "in": "path",
            "description": "Name of the field where to delete the index",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/cluster": {
      "get": {
        "tags": [
          "collections",
          "cluster"
        ],
        "summary": "Collection cluster info",
        "description": "Get cluster information for a collection",
        "operationId": "collection_cluster_info",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve the cluster info for",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionClusterInfo"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "collections",
          "cluster"
        ],
        "summary": "Update collection cluster setup",
        "operationId": "update_collection_cluster",
        "requestBody": {
          "description": "Collection cluster update operations",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ClusterOperations"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection on which to to apply the cluster update operation",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots/recover": {
      "put": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Recover from a snapshot",
        "description": "Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection.",
        "operationId": "recover_from_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Snapshot to recover from",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SnapshotRecover"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots": {
      "get": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "List collection snapshots",
        "description": "Get list of snapshots for a collection",
        "operationId": "list_snapshots",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/SnapshotDescription"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Create collection snapshot",
        "description": "Create new snapshot for a collection",
        "operationId": "create_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection for which to create a snapshot",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/SnapshotDescription"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots/{snapshot_name}": {
      "get": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Download collection snapshot",
        "description": "Download specified snapshot from a collection as a file",
        "operationId": "get_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "snapshot_name",
            "in": "path",
            "description": "Name of the snapshot to download",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "Snapshot file",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/snapshots": {
      "get": {
        "tags": [
          "snapshots"
        ],
        "summary": "List of storage snapshots",
        "description": "Get list of snapshots of the whole storage",
        "operationId": "list_full_snapshots",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/SnapshotDescription"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "snapshots"
        ],
        "summary": "Create storage snapshot",
        "description": "Create new snapshot of the whole storage",
        "operationId": "create_full_snapshot",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/SnapshotDescription"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/snapshots/{snapshot_name}": {
      "get": {
        "tags": [
          "snapshots"
        ],
        "summary": "Download storage snapshot",
        "description": "Download specified snapshot of the whole storage as a file",
        "operationId": "get_full_snapshot",
        "parameters": [
          {
            "name": "snapshot_name",
            "in": "path",
            "description": "Name of the snapshot to download",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "Snapshot file",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/{id}": {
      "get": {
        "tags": [
          "points"
        ],
        "summary": "Get point",
        "description": "Retrieve full information of single point by id",
        "operationId": "get_point",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Id of the point",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/Record"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Get points",
        "description": "Retrieve multiple points by specified IDs",
        "operationId": "get_points",
        "requestBody": {
          "description": "List of points to retrieve",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Record"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "points"
        ],
        "summary": "Upsert points",
        "description": "Perform insert + updates on points. If point with given ID already exists - it will be overwritten.",
        "operationId": "upsert_points",
        "requestBody": {
          "description": "Operation to perform on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointInsertOperations"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to update from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/delete": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Delete points",
        "description": "Delete points",
        "operationId": "delete_points",
        "requestBody": {
          "description": "Operation to perform on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointsSelector"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Set payload",
        "description": "Set payload values for points",
        "operationId": "set_payload",
        "requestBody": {
          "description": "Set payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetPayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to set from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "points"
        ],
        "summary": "Overwrite payload",
        "description": "Replace full payload of points with new one",
        "operationId": "overwrite_payload",
        "requestBody": {
          "description": "Payload and points selector",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetPayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to set from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload/delete": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Delete payload",
        "description": "Delete specified key payload for points",
        "operationId": "delete_payload",
        "requestBody": {
          "description": "delete payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DeletePayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload/clear": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Clear payload",
        "description": "Remove all payload for specified points",
        "operationId": "clear_payload",
        "requestBody": {
          "description": "clear payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointsSelector"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to clear payload from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/scroll": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Scroll points",
        "description": "Scroll request - paginate over all points which matches given filtering condition",
        "operationId": "scroll_points",
        "requestBody": {
          "description": "Pagination and filter parameters",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ScrollRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/ScrollResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/search": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Search points",
        "description": "Retrieve closest points based on vector similarity and given filtering conditions",
        "operationId": "search_points",
        "requestBody": {
          "description": "Search request with optional filtering",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ScoredPoint"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/search/batch": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Search batch points",
        "description": "Retrieve by batch the closest points based on vector similarity and given filtering conditions",
        "operationId": "search_batch_points",
        "requestBody": {
          "description": "Search batch request",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchRequestBatch"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/ScoredPoint"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/recommend": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Recommend points",
        "description": "Look for the points which are closer to stored positive examples and at the same time further to negative examples.",
        "operationId": "recommend_points",
        "requestBody": {
          "description": "Request points based on positive and negative examples.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecommendRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ScoredPoint"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/recommend/batch": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Recommend batch points",
        "description": "Look for the points which are closer to stored positive examples and at the same time further to negative examples.",
        "operationId": "recommend_batch_points",
        "requestBody": {
          "description": "Request points based on positive and negative examples.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecommendRequestBatch"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/ScoredPoint"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/count": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Count points",
        "description": "Count points which matches given filtering condition",
        "operationId": "count_points",
        "requestBody": {
          "description": "Request counts of points which matches given filtering condition",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CountRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to count in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CountResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "openapi": "3.0.1",
  "security": [],
  "info": {
    "title": "Qdrant API",
    "description": "API description for Qdrant vector search engine.\n\nThis document describes CRUD and search operations on collections of points (vectors with payload).\n\nQdrant supports any combinations of `should`, `must` and `must_not` conditions, which makes it possible to use in applications when object could not be described solely by vector. It could be location features, availability flags, and other custom properties businesses should take into account.\n## Examples\nThis examples cover the most basic use-cases - collection creation and basic vector search.\n### Create collection\nFirst - let's create a collection with dot-production metric.\n```\ncurl -X PUT 'http://localhost:6333/collections/test_collection' \\\n  -H 'Content-Type: application/json' \\\n  --data-raw '{\n    \"vectors\": {\n      \"size\": 4,\n      \"distance\": \"Dot\"\n    }\n  }'\n\n```\nExpected response:\n```\n{\n    \"result\": true,\n    \"status\": \"ok\",\n    \"time\": 0.031095451\n}\n```\nWe can ensure that collection was created:\n```\ncurl 'http://localhost:6333/collections/test_collection'\n```\nExpected response:\n```\n{\n  \"result\": {\n    \"status\": \"green\",\n    \"vectors_count\": 0,\n    \"segments_count\": 5,\n    \"disk_data_size\": 0,\n    \"ram_data_size\": 0,\n    \"config\": {\n      \"params\": {\n        \"vectors\": {\n          \"size\": 4,\n          \"distance\": \"Dot\"\n        }\n      },\n      \"hnsw_config\": {\n        \"m\": 16,\n        \"ef_construct\": 100,\n        \"full_scan_threshold\": 10000\n      },\n      \"optimizer_config\": {\n        \"deleted_threshold\": 0.2,\n        \"vacuum_min_vector_number\": 1000,\n        \"max_segment_number\": 5,\n        \"memmap_threshold\": 50000,\n        \"indexing_threshold\": 20000,\n        \"flush_interval_sec\": 1\n      },\n      \"wal_config\": {\n        \"wal_capacity_mb\": 32,\n        \"wal_segments_ahead\": 0\n      }\n    }\n  },\n  \"status\": \"ok\",\n  \"time\": 2.1199e-05\n}\n```\n\n### Add points\nLet's now add vectors with some payload:\n```\ncurl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n  \"points\": [\n    {\"id\": 1, \"vector\": [0.05, 0.61, 0.76, 0.74], \"payload\": {\"city\": \"Berlin\"}},\n    {\"id\": 2, \"vector\": [0.19, 0.81, 0.75, 0.11], \"payload\": {\"city\": [\"Berlin\", \"London\"] }},\n    {\"id\": 3, \"vector\": [0.36, 0.55, 0.47, 0.94], \"payload\": {\"city\": [\"Berlin\", \"Moscow\"] }},\n    {\"id\": 4, \"vector\": [0.18, 0.01, 0.85, 0.80], \"payload\": {\"city\": [\"London\", \"Moscow\"] }},\n    {\"id\": 5, \"vector\": [0.24, 0.18, 0.22, 0.44], \"payload\": {\"count\": [0]}},\n    {\"id\": 6, \"vector\": [0.35, 0.08, 0.11, 0.44]}\n  ]\n}'\n```\nExpected response:\n```\n{\n    \"result\": {\n        \"operation_id\": 0,\n        \"status\": \"completed\"\n    },\n    \"status\": \"ok\",\n    \"time\": 0.000206061\n}\n```\n### Search with filtering\nLet's start with a basic request:\n```\ncurl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n    \"vector\": [0.2,0.1,0.9,0.7],\n    \"top\": 3\n}'\n```\nExpected response:\n```\n{\n    \"result\": [\n        { \"id\": 4, \"score\": 1.362, \"payload\": null, \"version\": 0 },\n        { \"id\": 1, \"score\": 1.273, \"payload\": null, \"version\": 0 },\n        { \"id\": 3, \"score\": 1.208, \"payload\": null, \"version\": 0 }\n    ],\n    \"status\": \"ok\",\n    \"time\": 0.000055785\n}\n```\nBut result is different if we add a filter:\n```\ncurl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n    \"filter\": {\n        \"should\": [\n            {\n                \"key\": \"city\",\n                \"match\": {\n                    \"value\": \"London\"\n                }\n            }\n        ]\n    },\n    \"vector\": [0.2, 0.1, 0.9, 0.7],\n    \"top\": 3\n}'\n```\nExpected response:\n```\n{\n    \"result\": [\n        { \"id\": 4, \"score\": 1.362, \"payload\": null, \"version\": 0 },\n        { \"id\": 2, \"score\": 0.871, \"payload\": null, \"version\": 0 }\n    ],\n    \"status\": \"ok\",\n    \"time\": 0.000093972\n}\n```\n",
    "contact": {
      "email": "andrey@vasnetsov.com"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "v0.11.6"
  },
  "externalDocs": {
    "description": "Find out more about Qdrant applications and demo",
    "url": "https://qdrant.tech/documentation/"
  },
  "servers": [
    {
      "url": "{protocol}://{hostname}:{port}",
      "variables": {
        "protocol": {
          "enum": [
            "http",
            "https"
          ],
          "default": "http"
        },
        "hostname": {
          "default": "localhost"
        },
        "port": {
          "default": "6333"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "collections",
      "description": "Searchable collections of points."
    },
    {
      "name": "points",
      "description": "Float-point vectors with payload."
    },
    {
      "name": "cluster",
      "description": "Service distributed setup"
    },
    {
      "name": "snapshots",
      "description": "Storage and collections snapshots"
    }
  ],
  "components": {
    "schemas": {
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "time": {
            "type": "number",
            "format": "float",
            "description": "Time spent to process this request"
          },
          "status": {
            "type": "object",
            "properties": {
              "error": {
                "type": "string",
                "description": "Description of the occurred error."
              }
            }
          },
          "result": {
            "type": "object",
            "nullable": true
          }
        }
      },
      "CollectionsResponse": {
        "type": "object",
        "required": [
          "collections"
        ],
        "properties": {
          "collections": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CollectionDescription"
            }
          }
        }
      },
      "CollectionDescription": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string"
          }
        }
      },
      "CollectionInfo": {
        "description": "Current statistics and configuration of the collection",
        "type": "object",
        "required": [
          "config",
          "indexed_vectors_count",
          "optimizer_status",
          "payload_schema",
          "points_count",
          "segments_count",
          "status",
          "vectors_count"
        ],
        "properties": {
          "status": {
            "$ref": "#/components/schemas/CollectionStatus"
          },
          "optimizer_status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "vectors_count": {
            "description": "Number of vectors in collection All vectors in collection are available for querying Calculated as `points_count x vectors_per_point` Where `vectors_per_point` is a number of named vectors in schema",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "indexed_vectors_count": {
            "description": "Number of indexed vectors in the collection. Indexed vectors in large segments are faster to query, as it is stored in vector index (HNSW)",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "points_count": {
            "description": "Number of points (vectors + payloads) in collection Each point could be accessed by unique id",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "segments_count": {
            "description": "Number of segments in collection. Each segment has independent vector as payload indexes",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "config": {
            "$ref": "#/components/schemas/CollectionConfig"
          },
          "payload_schema": {
            "description": "Types of stored payload",
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/PayloadIndexInfo"
            }
          }
        }
      },
      "CollectionStatus": {
        "description": "Current state of the collection. `Green` - all good. `Yellow` - optimization is running, `Red` - some operations failed and was not recovered",
        "type": "string",
        "enum": [
          "green",
          "yellow",
          "red"
        ]
      },
      "OptimizersStatus": {
        "description": "Current state of the collection",
        "oneOf": [
          {
            "description": "Optimizers are reporting as expected",
            "type": "string",
            "enum": [
              "ok"
            ]
          },
          {
            "description": "Something wrong happened with optimizers",
            "type": "object",
            "required": [
              "error"
            ],
            "properties": {
              "error": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        ]
      },
      "CollectionConfig": {
        "type": "object",
        "required": [
          "hnsw_config",
          "optimizer_config",
          "params",
          "wal_config"
        ],
        "properties": {
          "params": {
            "$ref": "#/components/schemas/CollectionParams"
          },
          "hnsw_config": {
            "$ref": "#/components/schemas/HnswConfig"
          },
          "optimizer_config": {
            "$ref": "#/components/schemas/OptimizersConfig"
          },
          "wal_config": {
            "$ref": "#/components/schemas/WalConfig"
          }
        }
      },
      "CollectionParams": {
        "type": "object",
        "required": [
          "vectors"
        ],
        "properties": {
          "vectors": {
            "$ref": "#/components/schemas/VectorsConfig"
          },
          "shard_number": {
            "description": "Number of shards the collection has",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "replication_factor": {
            "description": "Number of replicas for each shard",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "write_consistency_factor": {
            "description": "Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "on_disk_payload": {
            "description": "If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.",
            "default": false,
            "type": "boolean"
          }
        }
      },
      "VectorsConfig": {
        "description": "Vector params separator for single and multiple vector modes Single mode:\n\n{ \"size\": 128, \"distance\": \"Cosine\" }\n\nor multiple mode:\n\n{ \"default\": { \"size\": 128, \"distance\": \"Cosine\" } }",
        "anyOf": [
          {
            "$ref": "#/components/schemas/VectorParams"
          },
          {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/VectorParams"
            }
          }
        ]
      },
      "VectorParams": {
        "description": "Params of single vector data storage",
        "type": "object",
        "required": [
          "distance",
          "size"
        ],
        "properties": {
          "size": {
            "description": "Size of a vectors used",
            "type": "integer",
            "format": "uint64",
            "minimum": 1
          },
          "distance": {
            "$ref": "#/components/schemas/Distance"
          }
        }
      },
      "Distance": {
        "description": "Type of internal tags, build from payload Distance function types used to compare vectors",
        "type": "string",
        "enum": [
          "Cosine",
          "Euclid",
          "Dot"
        ]
      },
      "HnswConfig": {
        "description": "Config of HNSW index",
        "type": "object",
        "required": [
          "ef_construct",
          "full_scan_threshold",
          "m"
        ],
        "properties": {
          "m": {
            "description": "Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "ef_construct": {
            "description": "Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "full_scan_threshold": {
            "description": "Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "max_indexing_threads": {
            "description": "Number of parallel threads used for background index building. If 0 - auto selection.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "on_disk": {
            "description": "Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false",
            "type": "boolean",
            "nullable": true
          },
          "payload_m": {
            "description": "Custom M param for hnsw graph built for payload index. If not set, default M will be used.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizersConfig": {
        "type": "object",
        "required": [
          "default_segment_number",
          "deleted_threshold",
          "flush_interval_sec",
          "indexing_threshold",
          "max_optimization_threads",
          "vacuum_min_vector_number"
        ],
        "properties": {
          "deleted_threshold": {
            "description": "The minimal fraction of deleted vectors in a segment, required to perform segment optimization",
            "type": "number",
            "format": "double"
          },
          "vacuum_min_vector_number": {
            "description": "The minimal number of vectors in a segment, required to perform segment optimization",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "default_segment_number": {
            "description": "Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS\n\nIt is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads If `default_segment_number = 0`, will be automatically selected by the number of available CPUs",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "max_segment_size": {
            "description": "Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.\n\nIf indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256 If not set, will be automatically selected considering the number of available CPUs.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "memmap_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256 If not set, mmap will not be used.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "indexing_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "flush_interval_sec": {
            "description": "Minimum interval between forced flushes.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "max_optimization_threads": {
            "description": "Maximum available threads for optimization workers",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "WalConfig": {
        "type": "object",
        "required": [
          "wal_capacity_mb",
          "wal_segments_ahead"
        ],
        "properties": {
          "wal_capacity_mb": {
            "description": "Size of a single WAL segment in MB",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "wal_segments_ahead": {
            "description": "Number of WAL segments to create ahead of actually used ones",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "PayloadIndexInfo": {
        "description": "Display payload field type & index information",
        "type": "object",
        "required": [
          "data_type",
          "points"
        ],
        "properties": {
          "data_type": {
            "$ref": "#/components/schemas/PayloadSchemaType"
          },
          "params": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/PayloadSchemaParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "points": {
            "description": "Number of points indexed with this index",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "PayloadSchemaType": {
        "description": "All possible names of payload types",
        "type": "string",
        "enum": [
          "keyword",
          "integer",
          "float",
          "geo",
          "text"
        ]
      },
      "PayloadSchemaParams": {
        "description": "Payload type with parameters",
        "anyOf": [
          {
            "$ref": "#/components/schemas/TextIndexParams"
          }
        ]
      },
      "TextIndexParams": {
        "type": "object",
        "required": [
          "type"
        ],
        "properties": {
          "type": {
            "$ref": "#/components/schemas/TextIndexType"
          },
          "tokenizer": {
            "$ref": "#/components/schemas/TokenizerType"
          },
          "min_token_len": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_token_len": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "lowercase": {
            "description": "If true, lowercase all tokens. Default: true",
            "type": "boolean",
            "nullable": true
          }
        }
      },
      "TextIndexType": {
        "type": "string",
        "enum": [
          "text"
        ]
      },
      "TokenizerType": {
        "type": "string",
        "enum": [
          "prefix",
          "whitespace",
          "word"
        ]
      },
      "PointRequest": {
        "type": "object",
        "required": [
          "ids"
        ],
        "properties": {
          "ids": {
            "description": "Look for points with ids",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: All",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "$ref": "#/components/schemas/WithVector"
          }
        }
      },
      "ExtendedPointId": {
        "description": "Type, used for specifying point ID in user interface",
        "anyOf": [
          {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          {
            "type": "string",
            "format": "uuid"
          }
        ]
      },
      "WithPayloadInterface": {
        "description": "Options for specifying which payload to include or not",
        "anyOf": [
          {
            "description": "If `true` - return all payload, If `false` - do not return payload",
            "type": "boolean"
          },
          {
            "description": "Specify which fields to return",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          {
            "$ref": "#/components/schemas/PayloadSelector"
          }
        ]
      },
      "PayloadSelector": {
        "description": "Specifies how to treat payload selector",
        "anyOf": [
          {
            "$ref": "#/components/schemas/PayloadSelectorInclude"
          },
          {
            "$ref": "#/components/schemas/PayloadSelectorExclude"
          }
        ]
      },
      "PayloadSelectorInclude": {
        "type": "object",
        "required": [
          "include"
        ],
        "properties": {
          "include": {
            "description": "Only include this payload keys",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      },
      "PayloadSelectorExclude": {
        "type": "object",
        "required": [
          "exclude"
        ],
        "properties": {
          "exclude": {
            "description": "Exclude this fields from returning payload",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      },
      "WithVector": {
        "description": "Options for specifying which vector to include",
        "anyOf": [
          {
            "description": "If `true` - return all vector, If `false` - do not return vector",
            "type": "boolean"
          },
          {
            "description": "Specify which vector to return",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        ]
      },
      "Record": {
        "description": "Point data",
        "type": "object",
        "required": [
          "id"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "payload": {
            "description": "Payload - values assigned to the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          },
          "vector": {
            "description": "Vector of the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/VectorStruct"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Payload": {
        "type": "object",
        "additionalProperties": true
      },
      "VectorStruct": {
        "description": "Full vector data per point separator with single and multiple vector modes",
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "number",
                "format": "float"
              }
            }
          }
        ]
      },
      "SearchRequest": {
        "description": "Search request. Holds all conditions and parameters for the search of most similar points by vector similarity given the filtering restrictions.",
        "type": "object",
        "required": [
          "limit",
          "vector"
        ],
        "properties": {
          "vector": {
            "$ref": "#/components/schemas/NamedVectorStruct"
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Additional search params",
            "anyOf": [
              {
                "$ref": "#/components/schemas/SearchParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Max number of result to return",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "offset": {
            "description": "Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: None",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "description": "Whether to return the point vector with the result?",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "score_threshold": {
            "description": "Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.",
            "type": "number",
            "format": "float",
            "nullable": true
          }
        }
      },
      "NamedVectorStruct": {
        "description": "Vector data separator for named and unnamed modes Unanmed mode:\n\n{ \"vector\": [1.0, 2.0, 3.0] }\n\nor named mode:\n\n{ \"vector\": { \"vector\": [1.0, 2.0, 3.0], \"name\": \"image-embeddings\" } }",
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "$ref": "#/components/schemas/NamedVector"
          }
        ]
      },
      "NamedVector": {
        "description": "Vector data with name",
        "type": "object",
        "required": [
          "name",
          "vector"
        ],
        "properties": {
          "name": {
            "description": "Name of vector data",
            "type": "string"
          },
          "vector": {
            "description": "Vector data",
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          }
        }
      },
      "Filter": {
        "type": "object",
        "properties": {
          "should": {
            "description": "At least one of those conditions should match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          },
          "must": {
            "description": "All conditions must match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          },
          "must_not": {
            "description": "All conditions must NOT match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "Condition": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/FieldCondition"
          },
          {
            "$ref": "#/components/schemas/IsEmptyCondition"
          },
          {
            "$ref": "#/components/schemas/HasIdCondition"
          },
          {
            "$ref": "#/components/schemas/Filter"
          }
        ]
      },
      "FieldCondition": {
        "description": "All possible payload filtering conditions",
        "type": "object",
        "required": [
          "key"
        ],
        "properties": {
          "key": {
            "description": "Payload key",
            "type": "string"
          },
          "match": {
            "description": "Check if point has field with a given value",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Match"
              },
              {
                "nullable": true
              }
            ]
          },
          "range": {
            "description": "Check if points value lies in a given range",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Range"
              },
              {
                "nullable": true
              }
            ]
          },
          "geo_bounding_box": {
            "description": "Check if points geo location lies in a given area",
            "anyOf": [
              {
                "$ref": "#/components/schemas/GeoBoundingBox"
              },
              {
                "nullable": true
              }
            ]
          },
          "geo_radius": {
            "description": "Check if geo point is within a given radius",
            "anyOf": [
              {
                "$ref": "#/components/schemas/GeoRadius"
              },
              {
                "nullable": true
              }
            ]
          },
          "values_count": {
            "description": "Check number of values of the field",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ValuesCount"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Match": {
        "description": "Match filter request",
        "anyOf": [
          {
            "$ref": "#/components/schemas/MatchValue"
          },
          {
            "$ref": "#/components/schemas/MatchText"
          }
        ]
      },
      "MatchValue": {
        "description": "Exact match of the given value",
        "type": "object",
        "required": [
          "value"
        ],
        "properties": {
          "value": {
            "$ref": "#/components/schemas/ValueVariants"
          }
        }
      },
      "ValueVariants": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "integer",
            "format": "int64"
          },
          {
            "type": "boolean"
          }
        ]
      },
      "MatchText": {
        "description": "Full-text match of the strings.",
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string"
          }
        }
      },
      "Range": {
        "description": "Range filter request",
        "type": "object",
        "properties": {
          "lt": {
            "description": "point.key < range.lt",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "gt": {
            "description": "point.key > range.gt",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "gte": {
            "description": "point.key >= range.gte",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "lte": {
            "description": "point.key <= range.lte",
            "type": "number",
            "format": "double",
            "nullable": true
          }
        }
      },
      "GeoBoundingBox": {
        "description": "Geo filter request\n\nMatches coordinates inside the rectangle, described by coordinates of lop-left and bottom-right edges",
        "type": "object",
        "required": [
          "bottom_right",
          "top_left"
        ],
        "properties": {
          "top_left": {
            "$ref": "#/components/schemas/GeoPoint"
          },
          "bottom_right": {
            "$ref": "#/components/schemas/GeoPoint"
          }
        }
      },
      "GeoPoint": {
        "description": "Geo point payload schema",
        "type": "object",
        "required": [
          "lat",
          "lon"
        ],
        "properties": {
          "lon": {
            "type": "number",
            "format": "double"
          },
          "lat": {
            "type": "number",
            "format": "double"
          }
        }
      },
      "GeoRadius": {
        "description": "Geo filter request\n\nMatches coordinates inside the circle of `radius` and center with coordinates `center`",
        "type": "object",
        "required": [
          "center",
          "radius"
        ],
        "properties": {
          "center": {
            "$ref": "#/components/schemas/GeoPoint"
          },
          "radius": {
            "description": "Radius of the area in meters",
            "type": "number",
            "format": "double"
          }
        }
      },
      "ValuesCount": {
        "description": "Values count filter request",
        "type": "object",
        "properties": {
          "lt": {
            "description": "point.key.length() < values_count.lt",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "gt": {
            "description": "point.key.length() > values_count.gt",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "gte": {
            "description": "point.key.length() >= values_count.gte",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "lte": {
            "description": "point.key.length() <= values_count.lte",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "IsEmptyCondition": {
        "description": "Select points with empty payload for a specified field",
        "type": "object",
        "required": [
          "is_empty"
        ],
        "properties": {
          "is_empty": {
            "$ref": "#/components/schemas/PayloadField"
          }
        }
      },
      "PayloadField": {
        "description": "Payload field",
        "type": "object",
        "required": [
          "key"
        ],
        "properties": {
          "key": {
            "description": "Payload field name",
            "type": "string"
          }
        }
      },
      "HasIdCondition": {
        "description": "ID-based filtering condition",
        "type": "object",
        "required": [
          "has_id"
        ],
        "properties": {
          "has_id": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "uniqueItems": true
          }
        }
      },
      "SearchParams": {
        "description": "Additional parameters of the search",
        "type": "object",
        "properties": {
          "hnsw_ef": {
            "description": "Params relevant to HNSW index /// Size of the beam in a beam-search. Larger the value - more accurate the result, more time required for search.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "exact": {
            "description": "Search without approximation. If set to true, search may run long but with exact results.",
            "default": false,
            "type": "boolean"
          }
        }
      },
      "ScoredPoint": {
        "description": "Search result",
        "type": "object",
        "required": [
          "id",
          "score",
          "version"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "version": {
            "description": "Point version",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "score": {
            "description": "Points vector distance to the query vector",
            "type": "number",
            "format": "float"
          },
          "payload": {
            "description": "Payload - values assigned to the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          },
          "vector": {
            "description": "Vector of the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/VectorStruct"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "UpdateResult": {
        "type": "object",
        "required": [
          "operation_id",
          "status"
        ],
        "properties": {
          "operation_id": {
            "description": "Sequential number of the operation",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "status": {
            "$ref": "#/components/schemas/UpdateStatus"
          }
        }
      },
      "UpdateStatus": {
        "description": "`Acknowledged` - Request is saved to WAL and will be process in a queue. `Completed` - Request is completed, changes are actual.",
        "type": "string",
        "enum": [
          "acknowledged",
          "completed"
        ]
      },
      "RecommendRequest": {
        "description": "Recommendation request. Provides positive and negative examples of the vectors, which are already stored in the collection.\n\nService should look for the points which are closer to positive examples and at the same time further to negative examples. The concrete way of how to compare negative and positive distances is up to implementation in `segment` crate.",
        "type": "object",
        "required": [
          "limit",
          "positive"
        ],
        "properties": {
          "positive": {
            "description": "Look for vectors closest to those",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "negative": {
            "description": "Try to avoid vectors like this",
            "default": [],
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Additional search params",
            "anyOf": [
              {
                "$ref": "#/components/schemas/SearchParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Max number of result to return",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "offset": {
            "description": "Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: None",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "description": "Whether to return the point vector with the result?",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "score_threshold": {
            "description": "Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.",
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "using": {
            "description": "Define which vector to use for recommendation, if not specified - try to use default vector",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/UsingVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "lookup_from": {
            "description": "The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/LookupLocation"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "UsingVector": {
        "anyOf": [
          {
            "type": "string"
          }
        ]
      },
      "LookupLocation": {
        "description": "Defines a location to use for looking up the vector. Specifies collection and vector field name.",
        "type": "object",
        "required": [
          "collection"
        ],
        "properties": {
          "collection": {
            "description": "Name of the collection used for lookup",
            "type": "string"
          },
          "vector": {
            "description": "Optional name of the vector field within the collection. If not provided, the default vector field will be used.",
            "default": null,
            "type": "string",
            "nullable": true
          }
        }
      },
      "ScrollRequest": {
        "description": "Scroll request - paginate over all points which matches given condition",
        "type": "object",
        "properties": {
          "offset": {
            "description": "Start ID to read points from.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ExtendedPointId"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Page size. Default: 10",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions. If not provided - all points.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: All",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "$ref": "#/components/schemas/WithVector"
          }
        }
      },
      "ScrollResult": {
        "description": "Result of the points read request",
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "description": "List of retrieved points",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Record"
            }
          },
          "next_page_offset": {
            "description": "Offset which should be used to retrieve a next page result",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ExtendedPointId"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "CreateCollection": {
        "description": "Operation for creating new collection and (optionally) specify index params",
        "type": "object",
        "required": [
          "vectors"
        ],
        "properties": {
          "vectors": {
            "$ref": "#/components/schemas/VectorsConfig"
          },
          "shard_number": {
            "description": "Number of shards in collection. Default is 1 for standalone, otherwise equal to the number of nodes Minimum is 1",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "replication_factor": {
            "description": "Number of shards replicas. Default is 1 Minimum is 1",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "write_consistency_factor": {
            "description": "Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "on_disk_payload": {
            "description": "If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.",
            "default": null,
            "type": "boolean",
            "nullable": true
          },
          "hnsw_config": {
            "description": "Custom params for HNSW index. If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/HnswConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "wal_config": {
            "description": "Custom params for WAL. If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WalConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "optimizers_config": {
            "description": "Custom params for Optimizers.  If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/OptimizersConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "HnswConfigDiff": {
        "type": "object",
        "properties": {
          "m": {
            "description": "Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "ef_construct": {
            "description": "Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "full_scan_threshold": {
            "description": "Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_indexing_threads": {
            "description": "Number of parallel threads used for background index building. If 0 - auto selection.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "on_disk": {
            "description": "Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false",
            "default": null,
            "type": "boolean",
            "nullable": true
          },
          "payload_m": {
            "description": "Custom M param for additional payload-aware HNSW links. If not set, default M will be used.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "WalConfigDiff": {
        "type": "object",
        "properties": {
          "wal_capacity_mb": {
            "description": "Size of a single WAL segment in MB",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "wal_segments_ahead": {
            "description": "Number of WAL segments to create ahead of actually used ones",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizersConfigDiff": {
        "type": "object",
        "properties": {
          "deleted_threshold": {
            "description": "The minimal fraction of deleted vectors in a segment, required to perform segment optimization",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "vacuum_min_vector_number": {
            "description": "The minimal number of vectors in a segment, required to perform segment optimization",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "default_segment_number": {
            "description": "Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS\n\nIt is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads If `default_segment_number = 0`, will be automatically selected by the number of available CPUs",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_segment_size": {
            "description": "Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.\n\nIf indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "memmap_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "indexing_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "flush_interval_sec": {
            "description": "Minimum interval between forced flushes.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "max_optimization_threads": {
            "description": "Maximum available threads for optimization workers",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "UpdateCollection": {
        "description": "Operation for updating parameters of the existing collection",
        "type": "object",
        "properties": {
          "optimizers_config": {
            "description": "Custom params for Optimizers.  If none - values from service configuration file are used. This operation is blocking, it will only proceed ones all current optimizations are complete",
            "anyOf": [
              {
                "$ref": "#/components/schemas/OptimizersConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Collection base params.  If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/CollectionParamsDiff"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "CollectionParamsDiff": {
        "type": "object",
        "properties": {
          "replication_factor": {
            "description": "Number of replicas for each shard",
            "type": "integer",
            "format": "uint32",
            "minimum": 1,
            "nullable": true
          },
          "write_consistency_factor": {
            "description": "Minimal number successful responses from replicas to consider operation successful",
            "type": "integer",
            "format": "uint32",
            "minimum": 1,
            "nullable": true
          }
        }
      },
      "ChangeAliasesOperation": {
        "description": "Operation for performing changes of collection aliases. Alias changes are atomic, meaning that no collection modifications can happen between alias operations.",
        "type": "object",
        "required": [
          "actions"
        ],
        "properties": {
          "actions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AliasOperations"
            }
          }
        }
      },
      "AliasOperations": {
        "description": "Group of all the possible operations related to collection aliases",
        "anyOf": [
          {
            "$ref": "#/components/schemas/CreateAliasOperation"
          },
          {
            "$ref": "#/components/schemas/DeleteAliasOperation"
          },
          {
            "$ref": "#/components/schemas/RenameAliasOperation"
          }
        ]
      },
      "CreateAliasOperation": {
        "type": "object",
        "required": [
          "create_alias"
        ],
        "properties": {
          "create_alias": {
            "$ref": "#/components/schemas/CreateAlias"
          }
        }
      },
      "CreateAlias": {
        "description": "Create alternative name for a collection. Collection will be available under both names for search, retrieve,",
        "type": "object",
        "required": [
          "alias_name",
          "collection_name"
        ],
        "properties": {
          "collection_name": {
            "type": "string"
          },
          "alias_name": {
            "type": "string"
          }
        }
      },
      "DeleteAliasOperation": {
        "description": "Delete alias if exists",
        "type": "object",
        "required": [
          "delete_alias"
        ],
        "properties": {
          "delete_alias": {
            "$ref": "#/components/schemas/DeleteAlias"
          }
        }
      },
      "DeleteAlias": {
        "description": "Delete alias if exists",
        "type": "object",
        "required": [
          "alias_name"
        ],
        "properties": {
          "alias_name": {
            "type": "string"
          }
        }
      },
      "RenameAliasOperation": {
        "description": "Change alias to a new one",
        "type": "object",
        "required": [
          "rename_alias"
        ],
        "properties": {
          "rename_alias": {
            "$ref": "#/components/schemas/RenameAlias"
          }
        }
      },
      "RenameAlias": {
        "description": "Change alias to a new one",
        "type": "object",
        "required": [
          "new_alias_name",
          "old_alias_name"
        ],
        "properties": {
          "old_alias_name": {
            "type": "string"
          },
          "new_alias_name": {
            "type": "string"
          }
        }
      },
      "CreateFieldIndex": {
        "type": "object",
        "required": [
          "field_name"
        ],
        "properties": {
          "field_name": {
            "type": "string"
          },
          "field_schema": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/PayloadFieldSchema"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "PayloadFieldSchema": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/PayloadSchemaType"
          },
          {
            "$ref": "#/components/schemas/PayloadSchemaParams"
          }
        ]
      },
      "PointsSelector": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/PointIdsList"
          },
          {
            "$ref": "#/components/schemas/FilterSelector"
          }
        ]
      },
      "PointIdsList": {
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          }
        }
      },
      "FilterSelector": {
        "type": "object",
        "required": [
          "filter"
        ],
        "properties": {
          "filter": {
            "$ref": "#/components/schemas/Filter"
          }
        }
      },
      "PointInsertOperations": {
        "oneOf": [
          {
            "$ref": "#/components/schemas/PointsBatch"
          },
          {
            "$ref": "#/components/schemas/PointsList"
          }
        ]
      },
      "BatchVectorStruct": {
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "array",
              "items": {
                "type": "number",
                "format": "float"
              }
            }
          },
          {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "array",
                "items": {
                  "type": "number",
                  "format": "float"
                }
              }
            }
          }
        ]
      },
      "PointStruct": {
        "type": "object",
        "required": [
          "id",
          "vector"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "vector": {
            "$ref": "#/components/schemas/VectorStruct"
          },
          "payload": {
            "description": "Payload values (optional)",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Batch": {
        "type": "object",
        "required": [
          "ids",
          "vectors"
        ],
        "properties": {
          "ids": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "vectors": {
            "$ref": "#/components/schemas/BatchVectorStruct"
          },
          "payloads": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/Payload"
                },
                {
                  "nullable": true
                }
              ]
            },
            "nullable": true
          }
        }
      },
      "PointsBatch": {
        "required": [
          "batch"
        ],
        "properties": {
          "batch": {
            "$ref": "#/components/schemas/Batch"
          }
        }
      },
      "PointsList": {
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PointStruct"
            }
          }
        }
      },
      "SetPayload": {
        "type": "object",
        "required": [
          "payload"
        ],
        "properties": {
          "payload": {
            "$ref": "#/components/schemas/Payload"
          },
          "points": {
            "description": "Assigns payload to each point in this list",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "nullable": true
          },
          "filter": {
            "description": "Assigns payload to each point that satisfy this filter condition",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "DeletePayload": {
        "type": "object",
        "required": [
          "keys"
        ],
        "properties": {
          "keys": {
            "description": "List of payload keys to remove from payload",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "points": {
            "description": "Deletes values from each point in this list",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "nullable": true
          },
          "filter": {
            "description": "Deletes values from points that satisfy this filter condition",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "ClusterStatus": {
        "description": "Information about current cluster status and structure",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "status"
            ],
            "properties": {
              "status": {
                "type": "string",
                "enum": [
                  "disabled"
                ]
              }
            }
          },
          {
            "description": "Description of enabled cluster",
            "type": "object",
            "required": [
              "consensus_thread_status",
              "message_send_failures",
              "peer_id",
              "peers",
              "raft_info",
              "status"
            ],
            "properties": {
              "status": {
                "type": "string",
                "enum": [
                  "enabled"
                ]
              },
              "peer_id": {
                "description": "ID of this peer",
                "type": "integer",
                "format": "uint64",
                "minimum": 0
              },
              "peers": {
                "description": "Peers composition of the cluster with main information",
                "type": "object",
                "additionalProperties": {
                  "$ref": "#/components/schemas/PeerInfo"
                }
              },
              "raft_info": {
                "$ref": "#/components/schemas/RaftInfo"
              },
              "consensus_thread_status": {
                "$ref": "#/components/schemas/ConsensusThreadStatus"
              },
              "message_send_failures": {
                "description": "Consequent failures of message send operations in consensus by peer address. On the first success to send to that peer - entry is removed from this hashmap.",
                "type": "object",
                "additionalProperties": {
                  "$ref": "#/components/schemas/MessageSendErrors"
                }
              }
            }
          }
        ]
      },
      "PeerInfo": {
        "description": "Information of a peer in the cluster",
        "type": "object",
        "required": [
          "uri"
        ],
        "properties": {
          "uri": {
            "type": "string"
          }
        }
      },
      "RaftInfo": {
        "description": "Summary information about the current raft state",
        "type": "object",
        "required": [
          "commit",
          "is_voter",
          "pending_operations",
          "term"
        ],
        "properties": {
          "term": {
            "description": "Raft divides time into terms of arbitrary length, each beginning with an election. If a candidate wins the election, it remains the leader for the rest of the term. The term number increases monotonically. Each server stores the current term number which is also exchanged in every communication.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "commit": {
            "description": "The index of the latest committed (finalized) operation that this peer is aware of.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "pending_operations": {
            "description": "Number of consensus operations pending to be applied on this peer",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "leader": {
            "description": "Leader of the current term",
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "role": {
            "description": "Role of this peer in the current term",
            "anyOf": [
              {
                "$ref": "#/components/schemas/StateRole"
              },
              {
                "nullable": true
              }
            ]
          },
          "is_voter": {
            "description": "Is this peer a voter or a learner",
            "type": "boolean"
          }
        }
      },
      "StateRole": {
        "description": "Role of the peer in the consensus",
        "type": "string",
        "enum": [
          "Follower",
          "Candidate",
          "Leader",
          "PreCandidate"
        ]
      },
      "ConsensusThreadStatus": {
        "description": "Information about current consensus thread status",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "consensus_thread_status",
              "last_update"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "working"
                ]
              },
              "last_update": {
                "type": "string",
                "format": "date-time"
              }
            }
          },
          {
            "type": "object",
            "required": [
              "consensus_thread_status"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "stopped"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "consensus_thread_status",
              "err"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "stopped_with_err"
                ]
              },
              "err": {
                "type": "string"
              }
            }
          }
        ]
      },
      "MessageSendErrors": {
        "description": "Message send failures for a particular peer",
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "latest_error": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "SnapshotDescription": {
        "type": "object",
        "required": [
          "name",
          "size"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "creation_time": {
            "type": "string",
            "format": "partial-date-time",
            "nullable": true
          },
          "size": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "CountRequest": {
        "description": "Count Request Counts the number of points which satisfy the given filter. If filter is not provided, the count of all points in the collection will be returned.",
        "type": "object",
        "properties": {
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "exact": {
            "description": "If true, count exact number of points. If false, count approximate number of points faster. Approximate count might be unreliable during the indexing process. Default: true",
            "default": true,
            "type": "boolean"
          }
        }
      },
      "CountResult": {
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "description": "Number of points which satisfy the conditions",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "CollectionClusterInfo": {
        "description": "Current clustering distribution for the collection",
        "type": "object",
        "required": [
          "local_shards",
          "peer_id",
          "remote_shards",
          "shard_count",
          "shard_transfers"
        ],
        "properties": {
          "peer_id": {
            "description": "ID of this peer",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "shard_count": {
            "description": "Total number of shards",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "local_shards": {
            "description": "Local shards",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/LocalShardInfo"
            }
          },
          "remote_shards": {
            "description": "Remote shards",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RemoteShardInfo"
            }
          },
          "shard_transfers": {
            "description": "Shard transfers",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ShardTransferInfo"
            }
          }
        }
      },
      "LocalShardInfo": {
        "type": "object",
        "required": [
          "points_count",
          "shard_id",
          "state"
        ],
        "properties": {
          "shard_id": {
            "description": "Local shard id",
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "points_count": {
            "description": "Number of points in the shard",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "state": {
            "$ref": "#/components/schemas/ReplicaState"
          }
        }
      },
      "ReplicaState": {
        "description": "State of the single shard within a replica set.",
        "type": "string",
        "enum": [
          "Active",
          "Dead",
          "Partial"
        ]
      },
      "RemoteShardInfo": {
        "type": "object",
        "required": [
          "peer_id",
          "shard_id",
          "state"
        ],
        "properties": {
          "shard_id": {
            "description": "Remote shard id",
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "description": "Remote peer id",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "state": {
            "$ref": "#/components/schemas/ReplicaState"
          }
        }
      },
      "ShardTransferInfo": {
        "type": "object",
        "required": [
          "from",
          "shard_id",
          "sync",
          "to"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "from": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "to": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "sync": {
            "description": "If `true` transfer is a synchronization of a replicas If `false` transfer is a moving of a shard from one peer to another",
            "type": "boolean"
          }
        }
      },
      "TelemetryData": {
        "type": "object",
        "required": [
          "app",
          "cluster",
          "collections",
          "id",
          "requests"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "app": {
            "$ref": "#/components/schemas/AppBuildTelemetry"
          },
          "collections": {
            "$ref": "#/components/schemas/CollectionsTelemetry"
          },
          "cluster": {
            "$ref": "#/components/schemas/ClusterTelemetry"
          },
          "requests": {
            "$ref": "#/components/schemas/RequestsTelemetry"
          }
        }
      },
      "AppBuildTelemetry": {
        "type": "object",
        "required": [
          "version"
        ],
        "properties": {
          "version": {
            "type": "string"
          },
          "features": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/AppFeaturesTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "system": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/RunningEnvironmentTelemetry"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "AppFeaturesTelemetry": {
        "type": "object",
        "required": [
          "debug",
          "service_debug_feature",
          "web_feature"
        ],
        "properties": {
          "debug": {
            "type": "boolean"
          },
          "web_feature": {
            "type": "boolean"
          },
          "service_debug_feature": {
            "type": "boolean"
          }
        }
      },
      "RunningEnvironmentTelemetry": {
        "type": "object",
        "required": [
          "cpu_flags",
          "is_docker"
        ],
        "properties": {
          "distribution": {
            "type": "string",
            "nullable": true
          },
          "distribution_version": {
            "type": "string",
            "nullable": true
          },
          "is_docker": {
            "type": "boolean"
          },
          "cores": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "ram_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "disk_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "cpu_flags": {
            "type": "string"
          }
        }
      },
      "CollectionsTelemetry": {
        "type": "object",
        "required": [
          "number_of_collections"
        ],
        "properties": {
          "number_of_collections": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "collections": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CollectionTelemetryEnum"
            },
            "nullable": true
          }
        }
      },
      "CollectionTelemetryEnum": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/CollectionTelemetry"
          },
          {
            "$ref": "#/components/schemas/CollectionsAggregatedTelemetry"
          }
        ]
      },
      "CollectionTelemetry": {
        "type": "object",
        "required": [
          "config",
          "id",
          "init_time_ms",
          "shards",
          "transfers"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "init_time_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "config": {
            "$ref": "#/components/schemas/CollectionConfig"
          },
          "shards": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ReplicaSetTelemetry"
            }
          },
          "transfers": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ShardTransferInfo"
            }
          }
        }
      },
      "ReplicaSetTelemetry": {
        "type": "object",
        "required": [
          "id",
          "remote",
          "replicate_states"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "local": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/LocalShardTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "remote": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RemoteShardTelemetry"
            }
          },
          "replicate_states": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/ReplicaState"
            }
          }
        }
      },
      "LocalShardTelemetry": {
        "type": "object",
        "required": [
          "optimizations",
          "segments"
        ],
        "properties": {
          "variant_name": {
            "type": "string",
            "nullable": true
          },
          "segments": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SegmentTelemetry"
            }
          },
          "optimizations": {
            "$ref": "#/components/schemas/OptimizerTelemetry"
          }
        }
      },
      "SegmentTelemetry": {
        "type": "object",
        "required": [
          "config",
          "info",
          "payload_field_indices",
          "vector_index_searches"
        ],
        "properties": {
          "info": {
            "$ref": "#/components/schemas/SegmentInfo"
          },
          "config": {
            "$ref": "#/components/schemas/SegmentConfig"
          },
          "vector_index_searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/VectorIndexSearchesTelemetry"
            }
          },
          "payload_field_indices": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PayloadIndexTelemetry"
            }
          }
        }
      },
      "SegmentInfo": {
        "description": "Aggregated information about segment",
        "type": "object",
        "required": [
          "disk_usage_bytes",
          "index_schema",
          "is_appendable",
          "num_deleted_vectors",
          "num_points",
          "num_vectors",
          "ram_usage_bytes",
          "segment_type"
        ],
        "properties": {
          "segment_type": {
            "$ref": "#/components/schemas/SegmentType"
          },
          "num_vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "num_points": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "num_deleted_vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "ram_usage_bytes": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "disk_usage_bytes": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "is_appendable": {
            "type": "boolean"
          },
          "index_schema": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/PayloadIndexInfo"
            }
          }
        }
      },
      "SegmentType": {
        "description": "Type of segment",
        "type": "string",
        "enum": [
          "plain",
          "indexed",
          "special"
        ]
      },
      "SegmentConfig": {
        "type": "object",
        "required": [
          "index",
          "storage_type",
          "vector_data"
        ],
        "properties": {
          "vector_data": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/VectorDataConfig"
            }
          },
          "index": {
            "$ref": "#/components/schemas/Indexes"
          },
          "storage_type": {
            "$ref": "#/components/schemas/StorageType"
          },
          "payload_storage_type": {
            "$ref": "#/components/schemas/PayloadStorageType"
          }
        }
      },
      "VectorDataConfig": {
        "description": "Config of single vector data storage",
        "type": "object",
        "required": [
          "distance",
          "size"
        ],
        "properties": {
          "size": {
            "description": "Size of a vectors used",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "distance": {
            "$ref": "#/components/schemas/Distance"
          }
        }
      },
      "Indexes": {
        "description": "Vector index configuration of the segment",
        "oneOf": [
          {
            "description": "Do not use any index, scan whole vector collection during search. Guarantee 100% precision, but may be time consuming on large collections.",
            "type": "object",
            "required": [
              "options",
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "plain"
                ]
              },
              "options": {
                "type": "object"
              }
            }
          },
          {
            "description": "Use filterable HNSW index for approximate search. Is very fast even on a very huge collections, but require additional space to store index and additional time to build it.",
            "type": "object",
            "required": [
              "options",
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "hnsw"
                ]
              },
              "options": {
                "$ref": "#/components/schemas/HnswConfig"
              }
            }
          }
        ]
      },
      "StorageType": {
        "description": "Type of vector storage",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "in_memory"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "mmap"
                ]
              }
            }
          }
        ]
      },
      "PayloadStorageType": {
        "description": "Type of payload storage",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "in_memory"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "on_disk"
                ]
              }
            }
          }
        ]
      },
      "VectorIndexSearchesTelemetry": {
        "type": "object",
        "required": [
          "filtered_exact",
          "filtered_large_cardinality",
          "filtered_plain",
          "filtered_small_cardinality",
          "unfiltered_exact",
          "unfiltered_hnsw",
          "unfiltered_plain"
        ],
        "properties": {
          "index_name": {
            "type": "string",
            "nullable": true
          },
          "unfiltered_plain": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "unfiltered_hnsw": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_plain": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_small_cardinality": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_large_cardinality": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_exact": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "unfiltered_exact": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "OperationDurationStatistics": {
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "fail_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "avg_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "min_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "max_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          }
        }
      },
      "PayloadIndexTelemetry": {
        "type": "object",
        "required": [
          "points_count",
          "points_values_count"
        ],
        "properties": {
          "field_name": {
            "type": "string",
            "nullable": true
          },
          "points_values_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "points_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "histogram_bucket_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizerTelemetry": {
        "type": "object",
        "required": [
          "optimizations",
          "status"
        ],
        "properties": {
          "status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "optimizations": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "RemoteShardTelemetry": {
        "type": "object",
        "required": [
          "searches",
          "shard_id",
          "updates"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "searches": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "updates": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "CollectionsAggregatedTelemetry": {
        "type": "object",
        "required": [
          "optimizers_status",
          "params",
          "vectors"
        ],
        "properties": {
          "vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "optimizers_status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "params": {
            "$ref": "#/components/schemas/CollectionParams"
          }
        }
      },
      "ClusterTelemetry": {
        "type": "object",
        "required": [
          "enabled"
        ],
        "properties": {
          "enabled": {
            "type": "boolean"
          },
          "status": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ClusterStatusTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "config": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ClusterConfigTelemetry"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "ClusterStatusTelemetry": {
        "type": "object",
        "required": [
          "commit",
          "consensus_thread_status",
          "is_voter",
          "number_of_peers",
          "pending_operations",
          "term"
        ],
        "properties": {
          "number_of_peers": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "term": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "commit": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "pending_operations": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "role": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/StateRole"
              },
              {
                "nullable": true
              }
            ]
          },
          "is_voter": {
            "type": "boolean"
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "consensus_thread_status": {
            "$ref": "#/components/schemas/ConsensusThreadStatus"
          }
        }
      },
      "ClusterConfigTelemetry": {
        "type": "object",
        "required": [
          "consensus",
          "grpc_timeout_ms",
          "p2p"
        ],
        "properties": {
          "grpc_timeout_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "p2p": {
            "$ref": "#/components/schemas/P2pConfigTelemetry"
          },
          "consensus": {
            "$ref": "#/components/schemas/ConsensusConfigTelemetry"
          }
        }
      },
      "P2pConfigTelemetry": {
        "type": "object",
        "required": [
          "connection_pool_size"
        ],
        "properties": {
          "connection_pool_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "ConsensusConfigTelemetry": {
        "type": "object",
        "required": [
          "bootstrap_timeout_sec",
          "max_message_queue_size",
          "tick_period_ms"
        ],
        "properties": {
          "max_message_queue_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "tick_period_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "bootstrap_timeout_sec": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "RequestsTelemetry": {
        "type": "object",
        "required": [
          "grpc",
          "rest"
        ],
        "properties": {
          "rest": {
            "$ref": "#/components/schemas/WebApiTelemetry"
          },
          "grpc": {
            "$ref": "#/components/schemas/GrpcTelemetry"
          }
        }
      },
      "WebApiTelemetry": {
        "type": "object",
        "required": [
          "responses"
        ],
        "properties": {
          "responses": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "additionalProperties": {
                "$ref": "#/components/schemas/OperationDurationStatistics"
              }
            }
          }
        }
      },
      "GrpcTelemetry": {
        "type": "object",
        "required": [
          "responses"
        ],
        "properties": {
          "responses": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/OperationDurationStatistics"
            }
          }
        }
      },
      "ClusterOperations": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/MoveShardOperation"
          },
          {
            "$ref": "#/components/schemas/ReplicateShardOperation"
          },
          {
            "$ref": "#/components/schemas/AbortTransferOperation"
          },
          {
            "$ref": "#/components/schemas/DropReplicaOperation"
          }
        ]
      },
      "MoveShardOperation": {
        "type": "object",
        "required": [
          "move_shard"
        ],
        "properties": {
          "move_shard": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "MoveShard": {
        "type": "object",
        "required": [
          "from_peer_id",
          "shard_id",
          "to_peer_id"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "to_peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "from_peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "ReplicateShardOperation": {
        "type": "object",
        "required": [
          "replicate_shard"
        ],
        "properties": {
          "replicate_shard": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "AbortTransferOperation": {
        "type": "object",
        "required": [
          "abort_transfer"
        ],
        "properties": {
          "abort_transfer": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "DropReplicaOperation": {
        "type": "object",
        "required": [
          "drop_replica"
        ],
        "properties": {
          "drop_replica": {
            "$ref": "#/components/schemas/Replica"
          }
        }
      },
      "Replica": {
        "type": "object",
        "required": [
          "peer_id",
          "shard_id"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "SearchRequestBatch": {
        "type": "object",
        "required": [
          "searches"
        ],
        "properties": {
          "searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SearchRequest"
            }
          }
        }
      },
      "RecommendRequestBatch": {
        "type": "object",
        "required": [
          "searches"
        ],
        "properties": {
          "searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RecommendRequest"
            }
          }
        }
      },
      "LocksOption": {
        "type": "object",
        "required": [
          "write"
        ],
        "properties": {
          "error_message": {
            "type": "string",
            "nullable": true
          },
          "write": {
            "type": "boolean"
          }
        }
      },
      "SnapshotRecover": {
        "type": "object",
        "required": [
          "location"
        ],
        "properties": {
          "location": {
            "description": "Examples: - URL `http://localhost:8080/collections/my_collection/snapshots/my_snapshot` - Local path `file:///qdrant/snapshots/test_collection-2022-08-04-10-49-10.snapshot`",
            "type": "string",
            "format": "uri"
          },
          "priority": {
            "$ref": "#/components/schemas/SnapshotPriority"
          }
        }
      },
      "SnapshotPriority": {
        "description": "Defines source of truth for snapshot recovery `Snapshot` means - prefer snapshot data over the current state `Replica` means - prefer existing data over the snapshot",
        "type": "string",
        "enum": [
          "snapshot",
          "replica"
        ]
      }
    }
  }
}



---
File: /docs/redoc/v0.11.7/openapi.json
---

{
  "paths": {
    "/telemetry": {
      "get": {
        "summary": "Collect telemetry data",
        "description": "Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics",
        "operationId": "telemetry",
        "tags": [
          "service"
        ],
        "parameters": [
          {
            "name": "anonymize",
            "in": "query",
            "description": "If true, anonymize result",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/TelemetryData"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/locks": {
      "post": {
        "summary": "Set lock options",
        "description": "Set lock options. If write is locked, all write operations and collection creation are forbidden. Returns previous lock options",
        "operationId": "post_locks",
        "tags": [
          "service"
        ],
        "requestBody": {
          "description": "Lock options and optional error message",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LocksOption"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/LocksOption"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Get lock options",
        "description": "Get lock options. If write is locked, all write operations and collection creation are forbidden",
        "operationId": "get_locks",
        "tags": [
          "service"
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/LocksOption"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cluster": {
      "get": {
        "tags": [
          "cluster"
        ],
        "summary": "Get cluster status info",
        "description": "Get information about the current state and composition of the cluster",
        "operationId": "cluster_status",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/ClusterStatus"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cluster/peer/{peer_id}": {
      "delete": {
        "tags": [
          "cluster"
        ],
        "summary": "Remove peer from the cluster",
        "description": "Tries to remove peer from the cluster. Will return an error if peer has shards on it.",
        "operationId": "remove_peer",
        "parameters": [
          {
            "name": "peer_id",
            "in": "path",
            "description": "Id of the peer",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "force",
            "in": "query",
            "description": "If true - removes peer even if it has shards/replicas on it.",
            "schema": {
              "type": "boolean",
              "default": false
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections": {
      "get": {
        "tags": [
          "collections"
        ],
        "summary": "List collections",
        "description": "Get list name of all existing collections",
        "operationId": "get_collections",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionsResponse"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}": {
      "get": {
        "tags": [
          "collections"
        ],
        "summary": "Collection info",
        "description": "Get detailed information about specified existing collection",
        "operationId": "get_collection",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionInfo"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "collections"
        ],
        "summary": "Create collection",
        "description": "Create new collection with given parameters",
        "operationId": "create_collection",
        "requestBody": {
          "description": "Parameters of a new collection",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCollection"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the new collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "patch": {
        "tags": [
          "collections"
        ],
        "summary": "Update collection parameters",
        "description": "Update parameters of the existing collection",
        "operationId": "update_collection",
        "requestBody": {
          "description": "New parameters",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCollection"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to update",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "collections"
        ],
        "summary": "Delete collection",
        "description": "Drop collection and all associated data",
        "operationId": "delete_collection",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/aliases": {
      "post": {
        "tags": [
          "collections"
        ],
        "summary": "Update aliases of the collections",
        "operationId": "update_aliases",
        "requestBody": {
          "description": "Alias update operations",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangeAliasesOperation"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/index": {
      "put": {
        "tags": [
          "collections"
        ],
        "summary": "Create index for field in collection",
        "description": "Create index for field in collection",
        "operationId": "create_field_index",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "requestBody": {
          "description": "Field name",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFieldIndex"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/index/{field_name}": {
      "delete": {
        "tags": [
          "collections"
        ],
        "summary": "Delete index for field in collection",
        "description": "Delete field index for collection",
        "operationId": "delete_field_index",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "field_name",
            "in": "path",
            "description": "Name of the field where to delete the index",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/cluster": {
      "get": {
        "tags": [
          "collections",
          "cluster"
        ],
        "summary": "Collection cluster info",
        "description": "Get cluster information for a collection",
        "operationId": "collection_cluster_info",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve the cluster info for",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CollectionClusterInfo"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "collections",
          "cluster"
        ],
        "summary": "Update collection cluster setup",
        "operationId": "update_collection_cluster",
        "requestBody": {
          "description": "Collection cluster update operations",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ClusterOperations"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection on which to to apply the cluster update operation",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "timeout",
            "in": "query",
            "description": "Wait for operation commit timeout in seconds. \nIf timeout is reached - request will return with service error.\n",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots/recover": {
      "put": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Recover from a snapshot",
        "description": "Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection.",
        "operationId": "recover_from_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Snapshot to recover from",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SnapshotRecover"
              }
            }
          }
        },
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots": {
      "get": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "List collection snapshots",
        "description": "Get list of snapshots for a collection",
        "operationId": "list_snapshots",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/SnapshotDescription"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Create collection snapshot",
        "description": "Create new snapshot for a collection",
        "operationId": "create_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection for which to create a snapshot",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/SnapshotDescription"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/snapshots/{snapshot_name}": {
      "get": {
        "tags": [
          "snapshots",
          "collections"
        ],
        "summary": "Download collection snapshot",
        "description": "Download specified snapshot from a collection as a file",
        "operationId": "get_snapshot",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "snapshot_name",
            "in": "path",
            "description": "Name of the snapshot to download",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "Snapshot file",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/snapshots": {
      "get": {
        "tags": [
          "snapshots"
        ],
        "summary": "List of storage snapshots",
        "description": "Get list of snapshots of the whole storage",
        "operationId": "list_full_snapshots",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/SnapshotDescription"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "snapshots"
        ],
        "summary": "Create storage snapshot",
        "description": "Create new snapshot of the whole storage",
        "operationId": "create_full_snapshot",
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/SnapshotDescription"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/snapshots/{snapshot_name}": {
      "get": {
        "tags": [
          "snapshots"
        ],
        "summary": "Download storage snapshot",
        "description": "Download specified snapshot of the whole storage as a file",
        "operationId": "get_full_snapshot",
        "parameters": [
          {
            "name": "snapshot_name",
            "in": "path",
            "description": "Name of the snapshot to download",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "Snapshot file",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/{id}": {
      "get": {
        "tags": [
          "points"
        ],
        "summary": "Get point",
        "description": "Retrieve full information of single point by id",
        "operationId": "get_point",
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Id of the point",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/Record"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Get points",
        "description": "Retrieve multiple points by specified IDs",
        "operationId": "get_points",
        "requestBody": {
          "description": "List of points to retrieve",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Record"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "points"
        ],
        "summary": "Upsert points",
        "description": "Perform insert + updates on points. If point with given ID already exists - it will be overwritten.",
        "operationId": "upsert_points",
        "requestBody": {
          "description": "Operation to perform on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointInsertOperations"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to update from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/delete": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Delete points",
        "description": "Delete points",
        "operationId": "delete_points",
        "requestBody": {
          "description": "Operation to perform on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointsSelector"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Set payload",
        "description": "Set payload values for points",
        "operationId": "set_payload",
        "requestBody": {
          "description": "Set payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetPayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to set from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "points"
        ],
        "summary": "Overwrite payload",
        "description": "Replace full payload of points with new one",
        "operationId": "overwrite_payload",
        "requestBody": {
          "description": "Payload and points selector",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetPayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to set from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload/delete": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Delete payload",
        "description": "Delete specified key payload for points",
        "operationId": "delete_payload",
        "requestBody": {
          "description": "delete payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DeletePayload"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to delete from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/payload/clear": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Clear payload",
        "description": "Remove all payload for specified points",
        "operationId": "clear_payload",
        "requestBody": {
          "description": "clear payload on points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PointsSelector"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to clear payload from",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "wait",
            "in": "query",
            "description": "If true, wait for changes to actually happen",
            "required": false,
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/UpdateResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/scroll": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Scroll points",
        "description": "Scroll request - paginate over all points which matches given filtering condition",
        "operationId": "scroll_points",
        "requestBody": {
          "description": "Pagination and filter parameters",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ScrollRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to retrieve from",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/ScrollResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/search": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Search points",
        "description": "Retrieve closest points based on vector similarity and given filtering conditions",
        "operationId": "search_points",
        "requestBody": {
          "description": "Search request with optional filtering",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ScoredPoint"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/search/batch": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Search batch points",
        "description": "Retrieve by batch the closest points based on vector similarity and given filtering conditions",
        "operationId": "search_batch_points",
        "requestBody": {
          "description": "Search batch request",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchRequestBatch"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/ScoredPoint"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/recommend": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Recommend points",
        "description": "Look for the points which are closer to stored positive examples and at the same time further to negative examples.",
        "operationId": "recommend_points",
        "requestBody": {
          "description": "Request points based on positive and negative examples.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecommendRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ScoredPoint"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/recommend/batch": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Recommend batch points",
        "description": "Look for the points which are closer to stored positive examples and at the same time further to negative examples.",
        "operationId": "recommend_batch_points",
        "requestBody": {
          "description": "Request points based on positive and negative examples.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecommendRequestBatch"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to search in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/ScoredPoint"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/collections/{collection_name}/points/count": {
      "post": {
        "tags": [
          "points"
        ],
        "summary": "Count points",
        "description": "Count points which matches given filtering condition",
        "operationId": "count_points",
        "requestBody": {
          "description": "Request counts of points which matches given filtering condition",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CountRequest"
              }
            }
          }
        },
        "parameters": [
          {
            "name": "collection_name",
            "in": "path",
            "description": "Name of the collection to count in",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "default": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "4XX": {
            "description": "error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "time": {
                      "type": "number",
                      "format": "float",
                      "description": "Time spent to process this request"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ok"
                      ]
                    },
                    "result": {
                      "$ref": "#/components/schemas/CountResult"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "openapi": "3.0.1",
  "security": [],
  "info": {
    "title": "Qdrant API",
    "description": "API description for Qdrant vector search engine.\n\nThis document describes CRUD and search operations on collections of points (vectors with payload).\n\nQdrant supports any combinations of `should`, `must` and `must_not` conditions, which makes it possible to use in applications when object could not be described solely by vector. It could be location features, availability flags, and other custom properties businesses should take into account.\n## Examples\nThis examples cover the most basic use-cases - collection creation and basic vector search.\n### Create collection\nFirst - let's create a collection with dot-production metric.\n```\ncurl -X PUT 'http://localhost:6333/collections/test_collection' \\\n  -H 'Content-Type: application/json' \\\n  --data-raw '{\n    \"vectors\": {\n      \"size\": 4,\n      \"distance\": \"Dot\"\n    }\n  }'\n\n```\nExpected response:\n```\n{\n    \"result\": true,\n    \"status\": \"ok\",\n    \"time\": 0.031095451\n}\n```\nWe can ensure that collection was created:\n```\ncurl 'http://localhost:6333/collections/test_collection'\n```\nExpected response:\n```\n{\n  \"result\": {\n    \"status\": \"green\",\n    \"vectors_count\": 0,\n    \"segments_count\": 5,\n    \"disk_data_size\": 0,\n    \"ram_data_size\": 0,\n    \"config\": {\n      \"params\": {\n        \"vectors\": {\n          \"size\": 4,\n          \"distance\": \"Dot\"\n        }\n      },\n      \"hnsw_config\": {\n        \"m\": 16,\n        \"ef_construct\": 100,\n        \"full_scan_threshold\": 10000\n      },\n      \"optimizer_config\": {\n        \"deleted_threshold\": 0.2,\n        \"vacuum_min_vector_number\": 1000,\n        \"max_segment_number\": 5,\n        \"memmap_threshold\": 50000,\n        \"indexing_threshold\": 20000,\n        \"flush_interval_sec\": 1\n      },\n      \"wal_config\": {\n        \"wal_capacity_mb\": 32,\n        \"wal_segments_ahead\": 0\n      }\n    }\n  },\n  \"status\": \"ok\",\n  \"time\": 2.1199e-05\n}\n```\n\n### Add points\nLet's now add vectors with some payload:\n```\ncurl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n  \"points\": [\n    {\"id\": 1, \"vector\": [0.05, 0.61, 0.76, 0.74], \"payload\": {\"city\": \"Berlin\"}},\n    {\"id\": 2, \"vector\": [0.19, 0.81, 0.75, 0.11], \"payload\": {\"city\": [\"Berlin\", \"London\"] }},\n    {\"id\": 3, \"vector\": [0.36, 0.55, 0.47, 0.94], \"payload\": {\"city\": [\"Berlin\", \"Moscow\"] }},\n    {\"id\": 4, \"vector\": [0.18, 0.01, 0.85, 0.80], \"payload\": {\"city\": [\"London\", \"Moscow\"] }},\n    {\"id\": 5, \"vector\": [0.24, 0.18, 0.22, 0.44], \"payload\": {\"count\": [0]}},\n    {\"id\": 6, \"vector\": [0.35, 0.08, 0.11, 0.44]}\n  ]\n}'\n```\nExpected response:\n```\n{\n    \"result\": {\n        \"operation_id\": 0,\n        \"status\": \"completed\"\n    },\n    \"status\": \"ok\",\n    \"time\": 0.000206061\n}\n```\n### Search with filtering\nLet's start with a basic request:\n```\ncurl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n    \"vector\": [0.2,0.1,0.9,0.7],\n    \"top\": 3\n}'\n```\nExpected response:\n```\n{\n    \"result\": [\n        { \"id\": 4, \"score\": 1.362, \"payload\": null, \"version\": 0 },\n        { \"id\": 1, \"score\": 1.273, \"payload\": null, \"version\": 0 },\n        { \"id\": 3, \"score\": 1.208, \"payload\": null, \"version\": 0 }\n    ],\n    \"status\": \"ok\",\n    \"time\": 0.000055785\n}\n```\nBut result is different if we add a filter:\n```\ncurl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \\ -H 'Content-Type: application/json' \\ --data-raw '{\n    \"filter\": {\n        \"should\": [\n            {\n                \"key\": \"city\",\n                \"match\": {\n                    \"value\": \"London\"\n                }\n            }\n        ]\n    },\n    \"vector\": [0.2, 0.1, 0.9, 0.7],\n    \"top\": 3\n}'\n```\nExpected response:\n```\n{\n    \"result\": [\n        { \"id\": 4, \"score\": 1.362, \"payload\": null, \"version\": 0 },\n        { \"id\": 2, \"score\": 0.871, \"payload\": null, \"version\": 0 }\n    ],\n    \"status\": \"ok\",\n    \"time\": 0.000093972\n}\n```\n",
    "contact": {
      "email": "andrey@vasnetsov.com"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "v0.11.7"
  },
  "externalDocs": {
    "description": "Find out more about Qdrant applications and demo",
    "url": "https://qdrant.tech/documentation/"
  },
  "servers": [
    {
      "url": "{protocol}://{hostname}:{port}",
      "variables": {
        "protocol": {
          "enum": [
            "http",
            "https"
          ],
          "default": "http"
        },
        "hostname": {
          "default": "localhost"
        },
        "port": {
          "default": "6333"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "collections",
      "description": "Searchable collections of points."
    },
    {
      "name": "points",
      "description": "Float-point vectors with payload."
    },
    {
      "name": "cluster",
      "description": "Service distributed setup"
    },
    {
      "name": "snapshots",
      "description": "Storage and collections snapshots"
    }
  ],
  "components": {
    "schemas": {
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "time": {
            "type": "number",
            "format": "float",
            "description": "Time spent to process this request"
          },
          "status": {
            "type": "object",
            "properties": {
              "error": {
                "type": "string",
                "description": "Description of the occurred error."
              }
            }
          },
          "result": {
            "type": "object",
            "nullable": true
          }
        }
      },
      "CollectionsResponse": {
        "type": "object",
        "required": [
          "collections"
        ],
        "properties": {
          "collections": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CollectionDescription"
            }
          }
        }
      },
      "CollectionDescription": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string"
          }
        }
      },
      "CollectionInfo": {
        "description": "Current statistics and configuration of the collection",
        "type": "object",
        "required": [
          "config",
          "indexed_vectors_count",
          "optimizer_status",
          "payload_schema",
          "points_count",
          "segments_count",
          "status",
          "vectors_count"
        ],
        "properties": {
          "status": {
            "$ref": "#/components/schemas/CollectionStatus"
          },
          "optimizer_status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "vectors_count": {
            "description": "Number of vectors in collection All vectors in collection are available for querying Calculated as `points_count x vectors_per_point` Where `vectors_per_point` is a number of named vectors in schema",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "indexed_vectors_count": {
            "description": "Number of indexed vectors in the collection. Indexed vectors in large segments are faster to query, as it is stored in vector index (HNSW)",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "points_count": {
            "description": "Number of points (vectors + payloads) in collection Each point could be accessed by unique id",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "segments_count": {
            "description": "Number of segments in collection. Each segment has independent vector as payload indexes",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "config": {
            "$ref": "#/components/schemas/CollectionConfig"
          },
          "payload_schema": {
            "description": "Types of stored payload",
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/PayloadIndexInfo"
            }
          }
        }
      },
      "CollectionStatus": {
        "description": "Current state of the collection. `Green` - all good. `Yellow` - optimization is running, `Red` - some operations failed and was not recovered",
        "type": "string",
        "enum": [
          "green",
          "yellow",
          "red"
        ]
      },
      "OptimizersStatus": {
        "description": "Current state of the collection",
        "oneOf": [
          {
            "description": "Optimizers are reporting as expected",
            "type": "string",
            "enum": [
              "ok"
            ]
          },
          {
            "description": "Something wrong happened with optimizers",
            "type": "object",
            "required": [
              "error"
            ],
            "properties": {
              "error": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        ]
      },
      "CollectionConfig": {
        "type": "object",
        "required": [
          "hnsw_config",
          "optimizer_config",
          "params",
          "wal_config"
        ],
        "properties": {
          "params": {
            "$ref": "#/components/schemas/CollectionParams"
          },
          "hnsw_config": {
            "$ref": "#/components/schemas/HnswConfig"
          },
          "optimizer_config": {
            "$ref": "#/components/schemas/OptimizersConfig"
          },
          "wal_config": {
            "$ref": "#/components/schemas/WalConfig"
          }
        }
      },
      "CollectionParams": {
        "type": "object",
        "required": [
          "vectors"
        ],
        "properties": {
          "vectors": {
            "$ref": "#/components/schemas/VectorsConfig"
          },
          "shard_number": {
            "description": "Number of shards the collection has",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "replication_factor": {
            "description": "Number of replicas for each shard",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "write_consistency_factor": {
            "description": "Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.",
            "default": 1,
            "type": "integer",
            "format": "uint32",
            "minimum": 1
          },
          "on_disk_payload": {
            "description": "If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.",
            "default": false,
            "type": "boolean"
          }
        }
      },
      "VectorsConfig": {
        "description": "Vector params separator for single and multiple vector modes Single mode:\n\n{ \"size\": 128, \"distance\": \"Cosine\" }\n\nor multiple mode:\n\n{ \"default\": { \"size\": 128, \"distance\": \"Cosine\" } }",
        "anyOf": [
          {
            "$ref": "#/components/schemas/VectorParams"
          },
          {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/VectorParams"
            }
          }
        ]
      },
      "VectorParams": {
        "description": "Params of single vector data storage",
        "type": "object",
        "required": [
          "distance",
          "size"
        ],
        "properties": {
          "size": {
            "description": "Size of a vectors used",
            "type": "integer",
            "format": "uint64",
            "minimum": 1
          },
          "distance": {
            "$ref": "#/components/schemas/Distance"
          }
        }
      },
      "Distance": {
        "description": "Type of internal tags, build from payload Distance function types used to compare vectors",
        "type": "string",
        "enum": [
          "Cosine",
          "Euclid",
          "Dot"
        ]
      },
      "HnswConfig": {
        "description": "Config of HNSW index",
        "type": "object",
        "required": [
          "ef_construct",
          "full_scan_threshold",
          "m"
        ],
        "properties": {
          "m": {
            "description": "Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "ef_construct": {
            "description": "Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "full_scan_threshold": {
            "description": "Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "max_indexing_threads": {
            "description": "Number of parallel threads used for background index building. If 0 - auto selection.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "on_disk": {
            "description": "Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false",
            "type": "boolean",
            "nullable": true
          },
          "payload_m": {
            "description": "Custom M param for hnsw graph built for payload index. If not set, default M will be used.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizersConfig": {
        "type": "object",
        "required": [
          "default_segment_number",
          "deleted_threshold",
          "flush_interval_sec",
          "indexing_threshold",
          "max_optimization_threads",
          "vacuum_min_vector_number"
        ],
        "properties": {
          "deleted_threshold": {
            "description": "The minimal fraction of deleted vectors in a segment, required to perform segment optimization",
            "type": "number",
            "format": "double"
          },
          "vacuum_min_vector_number": {
            "description": "The minimal number of vectors in a segment, required to perform segment optimization",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "default_segment_number": {
            "description": "Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS\n\nIt is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads If `default_segment_number = 0`, will be automatically selected by the number of available CPUs",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "max_segment_size": {
            "description": "Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.\n\nIf indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256 If not set, will be automatically selected considering the number of available CPUs.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "memmap_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256 If not set, mmap will not be used.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "indexing_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "flush_interval_sec": {
            "description": "Minimum interval between forced flushes.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "max_optimization_threads": {
            "description": "Maximum available threads for optimization workers",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "WalConfig": {
        "type": "object",
        "required": [
          "wal_capacity_mb",
          "wal_segments_ahead"
        ],
        "properties": {
          "wal_capacity_mb": {
            "description": "Size of a single WAL segment in MB",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "wal_segments_ahead": {
            "description": "Number of WAL segments to create ahead of actually used ones",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "PayloadIndexInfo": {
        "description": "Display payload field type & index information",
        "type": "object",
        "required": [
          "data_type",
          "points"
        ],
        "properties": {
          "data_type": {
            "$ref": "#/components/schemas/PayloadSchemaType"
          },
          "params": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/PayloadSchemaParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "points": {
            "description": "Number of points indexed with this index",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "PayloadSchemaType": {
        "description": "All possible names of payload types",
        "type": "string",
        "enum": [
          "keyword",
          "integer",
          "float",
          "geo",
          "text"
        ]
      },
      "PayloadSchemaParams": {
        "description": "Payload type with parameters",
        "anyOf": [
          {
            "$ref": "#/components/schemas/TextIndexParams"
          }
        ]
      },
      "TextIndexParams": {
        "type": "object",
        "required": [
          "type"
        ],
        "properties": {
          "type": {
            "$ref": "#/components/schemas/TextIndexType"
          },
          "tokenizer": {
            "$ref": "#/components/schemas/TokenizerType"
          },
          "min_token_len": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_token_len": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "lowercase": {
            "description": "If true, lowercase all tokens. Default: true",
            "type": "boolean",
            "nullable": true
          }
        }
      },
      "TextIndexType": {
        "type": "string",
        "enum": [
          "text"
        ]
      },
      "TokenizerType": {
        "type": "string",
        "enum": [
          "prefix",
          "whitespace",
          "word"
        ]
      },
      "PointRequest": {
        "type": "object",
        "required": [
          "ids"
        ],
        "properties": {
          "ids": {
            "description": "Look for points with ids",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: All",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "$ref": "#/components/schemas/WithVector"
          }
        }
      },
      "ExtendedPointId": {
        "description": "Type, used for specifying point ID in user interface",
        "anyOf": [
          {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          {
            "type": "string",
            "format": "uuid"
          }
        ]
      },
      "WithPayloadInterface": {
        "description": "Options for specifying which payload to include or not",
        "anyOf": [
          {
            "description": "If `true` - return all payload, If `false` - do not return payload",
            "type": "boolean"
          },
          {
            "description": "Specify which fields to return",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          {
            "$ref": "#/components/schemas/PayloadSelector"
          }
        ]
      },
      "PayloadSelector": {
        "description": "Specifies how to treat payload selector",
        "anyOf": [
          {
            "$ref": "#/components/schemas/PayloadSelectorInclude"
          },
          {
            "$ref": "#/components/schemas/PayloadSelectorExclude"
          }
        ]
      },
      "PayloadSelectorInclude": {
        "type": "object",
        "required": [
          "include"
        ],
        "properties": {
          "include": {
            "description": "Only include this payload keys",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      },
      "PayloadSelectorExclude": {
        "type": "object",
        "required": [
          "exclude"
        ],
        "properties": {
          "exclude": {
            "description": "Exclude this fields from returning payload",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      },
      "WithVector": {
        "description": "Options for specifying which vector to include",
        "anyOf": [
          {
            "description": "If `true` - return all vector, If `false` - do not return vector",
            "type": "boolean"
          },
          {
            "description": "Specify which vector to return",
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        ]
      },
      "Record": {
        "description": "Point data",
        "type": "object",
        "required": [
          "id"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "payload": {
            "description": "Payload - values assigned to the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          },
          "vector": {
            "description": "Vector of the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/VectorStruct"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Payload": {
        "type": "object",
        "additionalProperties": true
      },
      "VectorStruct": {
        "description": "Full vector data per point separator with single and multiple vector modes",
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "number",
                "format": "float"
              }
            }
          }
        ]
      },
      "SearchRequest": {
        "description": "Search request. Holds all conditions and parameters for the search of most similar points by vector similarity given the filtering restrictions.",
        "type": "object",
        "required": [
          "limit",
          "vector"
        ],
        "properties": {
          "vector": {
            "$ref": "#/components/schemas/NamedVectorStruct"
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Additional search params",
            "anyOf": [
              {
                "$ref": "#/components/schemas/SearchParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Max number of result to return",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "offset": {
            "description": "Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: None",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "description": "Whether to return the point vector with the result?",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "score_threshold": {
            "description": "Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.",
            "type": "number",
            "format": "float",
            "nullable": true
          }
        }
      },
      "NamedVectorStruct": {
        "description": "Vector data separator for named and unnamed modes Unanmed mode:\n\n{ \"vector\": [1.0, 2.0, 3.0] }\n\nor named mode:\n\n{ \"vector\": { \"vector\": [1.0, 2.0, 3.0], \"name\": \"image-embeddings\" } }",
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          },
          {
            "$ref": "#/components/schemas/NamedVector"
          }
        ]
      },
      "NamedVector": {
        "description": "Vector data with name",
        "type": "object",
        "required": [
          "name",
          "vector"
        ],
        "properties": {
          "name": {
            "description": "Name of vector data",
            "type": "string"
          },
          "vector": {
            "description": "Vector data",
            "type": "array",
            "items": {
              "type": "number",
              "format": "float"
            }
          }
        }
      },
      "Filter": {
        "type": "object",
        "properties": {
          "should": {
            "description": "At least one of those conditions should match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          },
          "must": {
            "description": "All conditions must match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          },
          "must_not": {
            "description": "All conditions must NOT match",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Condition"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "Condition": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/FieldCondition"
          },
          {
            "$ref": "#/components/schemas/IsEmptyCondition"
          },
          {
            "$ref": "#/components/schemas/HasIdCondition"
          },
          {
            "$ref": "#/components/schemas/Filter"
          }
        ]
      },
      "FieldCondition": {
        "description": "All possible payload filtering conditions",
        "type": "object",
        "required": [
          "key"
        ],
        "properties": {
          "key": {
            "description": "Payload key",
            "type": "string"
          },
          "match": {
            "description": "Check if point has field with a given value",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Match"
              },
              {
                "nullable": true
              }
            ]
          },
          "range": {
            "description": "Check if points value lies in a given range",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Range"
              },
              {
                "nullable": true
              }
            ]
          },
          "geo_bounding_box": {
            "description": "Check if points geo location lies in a given area",
            "anyOf": [
              {
                "$ref": "#/components/schemas/GeoBoundingBox"
              },
              {
                "nullable": true
              }
            ]
          },
          "geo_radius": {
            "description": "Check if geo point is within a given radius",
            "anyOf": [
              {
                "$ref": "#/components/schemas/GeoRadius"
              },
              {
                "nullable": true
              }
            ]
          },
          "values_count": {
            "description": "Check number of values of the field",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ValuesCount"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Match": {
        "description": "Match filter request",
        "anyOf": [
          {
            "$ref": "#/components/schemas/MatchValue"
          },
          {
            "$ref": "#/components/schemas/MatchText"
          }
        ]
      },
      "MatchValue": {
        "description": "Exact match of the given value",
        "type": "object",
        "required": [
          "value"
        ],
        "properties": {
          "value": {
            "$ref": "#/components/schemas/ValueVariants"
          }
        }
      },
      "ValueVariants": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "integer",
            "format": "int64"
          },
          {
            "type": "boolean"
          }
        ]
      },
      "MatchText": {
        "description": "Full-text match of the strings.",
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string"
          }
        }
      },
      "Range": {
        "description": "Range filter request",
        "type": "object",
        "properties": {
          "lt": {
            "description": "point.key < range.lt",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "gt": {
            "description": "point.key > range.gt",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "gte": {
            "description": "point.key >= range.gte",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "lte": {
            "description": "point.key <= range.lte",
            "type": "number",
            "format": "double",
            "nullable": true
          }
        }
      },
      "GeoBoundingBox": {
        "description": "Geo filter request\n\nMatches coordinates inside the rectangle, described by coordinates of lop-left and bottom-right edges",
        "type": "object",
        "required": [
          "bottom_right",
          "top_left"
        ],
        "properties": {
          "top_left": {
            "$ref": "#/components/schemas/GeoPoint"
          },
          "bottom_right": {
            "$ref": "#/components/schemas/GeoPoint"
          }
        }
      },
      "GeoPoint": {
        "description": "Geo point payload schema",
        "type": "object",
        "required": [
          "lat",
          "lon"
        ],
        "properties": {
          "lon": {
            "type": "number",
            "format": "double"
          },
          "lat": {
            "type": "number",
            "format": "double"
          }
        }
      },
      "GeoRadius": {
        "description": "Geo filter request\n\nMatches coordinates inside the circle of `radius` and center with coordinates `center`",
        "type": "object",
        "required": [
          "center",
          "radius"
        ],
        "properties": {
          "center": {
            "$ref": "#/components/schemas/GeoPoint"
          },
          "radius": {
            "description": "Radius of the area in meters",
            "type": "number",
            "format": "double"
          }
        }
      },
      "ValuesCount": {
        "description": "Values count filter request",
        "type": "object",
        "properties": {
          "lt": {
            "description": "point.key.length() < values_count.lt",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "gt": {
            "description": "point.key.length() > values_count.gt",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "gte": {
            "description": "point.key.length() >= values_count.gte",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "lte": {
            "description": "point.key.length() <= values_count.lte",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "IsEmptyCondition": {
        "description": "Select points with empty payload for a specified field",
        "type": "object",
        "required": [
          "is_empty"
        ],
        "properties": {
          "is_empty": {
            "$ref": "#/components/schemas/PayloadField"
          }
        }
      },
      "PayloadField": {
        "description": "Payload field",
        "type": "object",
        "required": [
          "key"
        ],
        "properties": {
          "key": {
            "description": "Payload field name",
            "type": "string"
          }
        }
      },
      "HasIdCondition": {
        "description": "ID-based filtering condition",
        "type": "object",
        "required": [
          "has_id"
        ],
        "properties": {
          "has_id": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "uniqueItems": true
          }
        }
      },
      "SearchParams": {
        "description": "Additional parameters of the search",
        "type": "object",
        "properties": {
          "hnsw_ef": {
            "description": "Params relevant to HNSW index /// Size of the beam in a beam-search. Larger the value - more accurate the result, more time required for search.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "exact": {
            "description": "Search without approximation. If set to true, search may run long but with exact results.",
            "default": false,
            "type": "boolean"
          }
        }
      },
      "ScoredPoint": {
        "description": "Search result",
        "type": "object",
        "required": [
          "id",
          "score",
          "version"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "version": {
            "description": "Point version",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "score": {
            "description": "Points vector distance to the query vector",
            "type": "number",
            "format": "float"
          },
          "payload": {
            "description": "Payload - values assigned to the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          },
          "vector": {
            "description": "Vector of the point",
            "anyOf": [
              {
                "$ref": "#/components/schemas/VectorStruct"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "UpdateResult": {
        "type": "object",
        "required": [
          "operation_id",
          "status"
        ],
        "properties": {
          "operation_id": {
            "description": "Sequential number of the operation",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "status": {
            "$ref": "#/components/schemas/UpdateStatus"
          }
        }
      },
      "UpdateStatus": {
        "description": "`Acknowledged` - Request is saved to WAL and will be process in a queue. `Completed` - Request is completed, changes are actual.",
        "type": "string",
        "enum": [
          "acknowledged",
          "completed"
        ]
      },
      "RecommendRequest": {
        "description": "Recommendation request. Provides positive and negative examples of the vectors, which are already stored in the collection.\n\nService should look for the points which are closer to positive examples and at the same time further to negative examples. The concrete way of how to compare negative and positive distances is up to implementation in `segment` crate.",
        "type": "object",
        "required": [
          "limit",
          "positive"
        ],
        "properties": {
          "positive": {
            "description": "Look for vectors closest to those",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "negative": {
            "description": "Try to avoid vectors like this",
            "default": [],
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Additional search params",
            "anyOf": [
              {
                "$ref": "#/components/schemas/SearchParams"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Max number of result to return",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "offset": {
            "description": "Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.",
            "default": 0,
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: None",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "description": "Whether to return the point vector with the result?",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "score_threshold": {
            "description": "Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.",
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "using": {
            "description": "Define which vector to use for recommendation, if not specified - try to use default vector",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/UsingVector"
              },
              {
                "nullable": true
              }
            ]
          },
          "lookup_from": {
            "description": "The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection",
            "default": null,
            "anyOf": [
              {
                "$ref": "#/components/schemas/LookupLocation"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "UsingVector": {
        "anyOf": [
          {
            "type": "string"
          }
        ]
      },
      "LookupLocation": {
        "description": "Defines a location to use for looking up the vector. Specifies collection and vector field name.",
        "type": "object",
        "required": [
          "collection"
        ],
        "properties": {
          "collection": {
            "description": "Name of the collection used for lookup",
            "type": "string"
          },
          "vector": {
            "description": "Optional name of the vector field within the collection. If not provided, the default vector field will be used.",
            "default": null,
            "type": "string",
            "nullable": true
          }
        }
      },
      "ScrollRequest": {
        "description": "Scroll request - paginate over all points which matches given condition",
        "type": "object",
        "properties": {
          "offset": {
            "description": "Start ID to read points from.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ExtendedPointId"
              },
              {
                "nullable": true
              }
            ]
          },
          "limit": {
            "description": "Page size. Default: 10",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "filter": {
            "description": "Look only for points which satisfies this conditions. If not provided - all points.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_payload": {
            "description": "Select which payload to return with the response. Default: All",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WithPayloadInterface"
              },
              {
                "nullable": true
              }
            ]
          },
          "with_vector": {
            "$ref": "#/components/schemas/WithVector"
          }
        }
      },
      "ScrollResult": {
        "description": "Result of the points read request",
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "description": "List of retrieved points",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Record"
            }
          },
          "next_page_offset": {
            "description": "Offset which should be used to retrieve a next page result",
            "anyOf": [
              {
                "$ref": "#/components/schemas/ExtendedPointId"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "CreateCollection": {
        "description": "Operation for creating new collection and (optionally) specify index params",
        "type": "object",
        "required": [
          "vectors"
        ],
        "properties": {
          "vectors": {
            "$ref": "#/components/schemas/VectorsConfig"
          },
          "shard_number": {
            "description": "Number of shards in collection. Default is 1 for standalone, otherwise equal to the number of nodes Minimum is 1",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "replication_factor": {
            "description": "Number of shards replicas. Default is 1 Minimum is 1",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "write_consistency_factor": {
            "description": "Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.",
            "default": null,
            "type": "integer",
            "format": "uint32",
            "minimum": 0,
            "nullable": true
          },
          "on_disk_payload": {
            "description": "If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.",
            "default": null,
            "type": "boolean",
            "nullable": true
          },
          "hnsw_config": {
            "description": "Custom params for HNSW index. If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/HnswConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "wal_config": {
            "description": "Custom params for WAL. If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/WalConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "optimizers_config": {
            "description": "Custom params for Optimizers.  If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/OptimizersConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "HnswConfigDiff": {
        "type": "object",
        "properties": {
          "m": {
            "description": "Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "ef_construct": {
            "description": "Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "full_scan_threshold": {
            "description": "Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_indexing_threads": {
            "description": "Number of parallel threads used for background index building. If 0 - auto selection.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "on_disk": {
            "description": "Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false",
            "default": null,
            "type": "boolean",
            "nullable": true
          },
          "payload_m": {
            "description": "Custom M param for additional payload-aware HNSW links. If not set, default M will be used.",
            "default": null,
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "WalConfigDiff": {
        "type": "object",
        "properties": {
          "wal_capacity_mb": {
            "description": "Size of a single WAL segment in MB",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "wal_segments_ahead": {
            "description": "Number of WAL segments to create ahead of actually used ones",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizersConfigDiff": {
        "type": "object",
        "properties": {
          "deleted_threshold": {
            "description": "The minimal fraction of deleted vectors in a segment, required to perform segment optimization",
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "vacuum_min_vector_number": {
            "description": "The minimal number of vectors in a segment, required to perform segment optimization",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "default_segment_number": {
            "description": "Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS\n\nIt is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads If `default_segment_number = 0`, will be automatically selected by the number of available CPUs",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "max_segment_size": {
            "description": "Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.\n\nIf indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "memmap_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "indexing_threshold": {
            "description": "Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "flush_interval_sec": {
            "description": "Minimum interval between forced flushes.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "max_optimization_threads": {
            "description": "Maximum available threads for optimization workers",
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "UpdateCollection": {
        "description": "Operation for updating parameters of the existing collection",
        "type": "object",
        "properties": {
          "optimizers_config": {
            "description": "Custom params for Optimizers.  If none - values from service configuration file are used. This operation is blocking, it will only proceed ones all current optimizations are complete",
            "anyOf": [
              {
                "$ref": "#/components/schemas/OptimizersConfigDiff"
              },
              {
                "nullable": true
              }
            ]
          },
          "params": {
            "description": "Collection base params.  If none - values from service configuration file are used.",
            "anyOf": [
              {
                "$ref": "#/components/schemas/CollectionParamsDiff"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "CollectionParamsDiff": {
        "type": "object",
        "properties": {
          "replication_factor": {
            "description": "Number of replicas for each shard",
            "type": "integer",
            "format": "uint32",
            "minimum": 1,
            "nullable": true
          },
          "write_consistency_factor": {
            "description": "Minimal number successful responses from replicas to consider operation successful",
            "type": "integer",
            "format": "uint32",
            "minimum": 1,
            "nullable": true
          }
        }
      },
      "ChangeAliasesOperation": {
        "description": "Operation for performing changes of collection aliases. Alias changes are atomic, meaning that no collection modifications can happen between alias operations.",
        "type": "object",
        "required": [
          "actions"
        ],
        "properties": {
          "actions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AliasOperations"
            }
          }
        }
      },
      "AliasOperations": {
        "description": "Group of all the possible operations related to collection aliases",
        "anyOf": [
          {
            "$ref": "#/components/schemas/CreateAliasOperation"
          },
          {
            "$ref": "#/components/schemas/DeleteAliasOperation"
          },
          {
            "$ref": "#/components/schemas/RenameAliasOperation"
          }
        ]
      },
      "CreateAliasOperation": {
        "type": "object",
        "required": [
          "create_alias"
        ],
        "properties": {
          "create_alias": {
            "$ref": "#/components/schemas/CreateAlias"
          }
        }
      },
      "CreateAlias": {
        "description": "Create alternative name for a collection. Collection will be available under both names for search, retrieve,",
        "type": "object",
        "required": [
          "alias_name",
          "collection_name"
        ],
        "properties": {
          "collection_name": {
            "type": "string"
          },
          "alias_name": {
            "type": "string"
          }
        }
      },
      "DeleteAliasOperation": {
        "description": "Delete alias if exists",
        "type": "object",
        "required": [
          "delete_alias"
        ],
        "properties": {
          "delete_alias": {
            "$ref": "#/components/schemas/DeleteAlias"
          }
        }
      },
      "DeleteAlias": {
        "description": "Delete alias if exists",
        "type": "object",
        "required": [
          "alias_name"
        ],
        "properties": {
          "alias_name": {
            "type": "string"
          }
        }
      },
      "RenameAliasOperation": {
        "description": "Change alias to a new one",
        "type": "object",
        "required": [
          "rename_alias"
        ],
        "properties": {
          "rename_alias": {
            "$ref": "#/components/schemas/RenameAlias"
          }
        }
      },
      "RenameAlias": {
        "description": "Change alias to a new one",
        "type": "object",
        "required": [
          "new_alias_name",
          "old_alias_name"
        ],
        "properties": {
          "old_alias_name": {
            "type": "string"
          },
          "new_alias_name": {
            "type": "string"
          }
        }
      },
      "CreateFieldIndex": {
        "type": "object",
        "required": [
          "field_name"
        ],
        "properties": {
          "field_name": {
            "type": "string"
          },
          "field_schema": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/PayloadFieldSchema"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "PayloadFieldSchema": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/PayloadSchemaType"
          },
          {
            "$ref": "#/components/schemas/PayloadSchemaParams"
          }
        ]
      },
      "PointsSelector": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/PointIdsList"
          },
          {
            "$ref": "#/components/schemas/FilterSelector"
          }
        ]
      },
      "PointIdsList": {
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          }
        }
      },
      "FilterSelector": {
        "type": "object",
        "required": [
          "filter"
        ],
        "properties": {
          "filter": {
            "$ref": "#/components/schemas/Filter"
          }
        }
      },
      "PointInsertOperations": {
        "oneOf": [
          {
            "$ref": "#/components/schemas/PointsBatch"
          },
          {
            "$ref": "#/components/schemas/PointsList"
          }
        ]
      },
      "BatchVectorStruct": {
        "anyOf": [
          {
            "type": "array",
            "items": {
              "type": "array",
              "items": {
                "type": "number",
                "format": "float"
              }
            }
          },
          {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "array",
                "items": {
                  "type": "number",
                  "format": "float"
                }
              }
            }
          }
        ]
      },
      "PointStruct": {
        "type": "object",
        "required": [
          "id",
          "vector"
        ],
        "properties": {
          "id": {
            "$ref": "#/components/schemas/ExtendedPointId"
          },
          "vector": {
            "$ref": "#/components/schemas/VectorStruct"
          },
          "payload": {
            "description": "Payload values (optional)",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Payload"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "Batch": {
        "type": "object",
        "required": [
          "ids",
          "vectors"
        ],
        "properties": {
          "ids": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            }
          },
          "vectors": {
            "$ref": "#/components/schemas/BatchVectorStruct"
          },
          "payloads": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/Payload"
                },
                {
                  "nullable": true
                }
              ]
            },
            "nullable": true
          }
        }
      },
      "PointsBatch": {
        "required": [
          "batch"
        ],
        "properties": {
          "batch": {
            "$ref": "#/components/schemas/Batch"
          }
        }
      },
      "PointsList": {
        "type": "object",
        "required": [
          "points"
        ],
        "properties": {
          "points": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PointStruct"
            }
          }
        }
      },
      "SetPayload": {
        "type": "object",
        "required": [
          "payload"
        ],
        "properties": {
          "payload": {
            "$ref": "#/components/schemas/Payload"
          },
          "points": {
            "description": "Assigns payload to each point in this list",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "nullable": true
          },
          "filter": {
            "description": "Assigns payload to each point that satisfy this filter condition",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "DeletePayload": {
        "type": "object",
        "required": [
          "keys"
        ],
        "properties": {
          "keys": {
            "description": "List of payload keys to remove from payload",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "points": {
            "description": "Deletes values from each point in this list",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ExtendedPointId"
            },
            "nullable": true
          },
          "filter": {
            "description": "Deletes values from points that satisfy this filter condition",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "ClusterStatus": {
        "description": "Information about current cluster status and structure",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "status"
            ],
            "properties": {
              "status": {
                "type": "string",
                "enum": [
                  "disabled"
                ]
              }
            }
          },
          {
            "description": "Description of enabled cluster",
            "type": "object",
            "required": [
              "consensus_thread_status",
              "message_send_failures",
              "peer_id",
              "peers",
              "raft_info",
              "status"
            ],
            "properties": {
              "status": {
                "type": "string",
                "enum": [
                  "enabled"
                ]
              },
              "peer_id": {
                "description": "ID of this peer",
                "type": "integer",
                "format": "uint64",
                "minimum": 0
              },
              "peers": {
                "description": "Peers composition of the cluster with main information",
                "type": "object",
                "additionalProperties": {
                  "$ref": "#/components/schemas/PeerInfo"
                }
              },
              "raft_info": {
                "$ref": "#/components/schemas/RaftInfo"
              },
              "consensus_thread_status": {
                "$ref": "#/components/schemas/ConsensusThreadStatus"
              },
              "message_send_failures": {
                "description": "Consequent failures of message send operations in consensus by peer address. On the first success to send to that peer - entry is removed from this hashmap.",
                "type": "object",
                "additionalProperties": {
                  "$ref": "#/components/schemas/MessageSendErrors"
                }
              }
            }
          }
        ]
      },
      "PeerInfo": {
        "description": "Information of a peer in the cluster",
        "type": "object",
        "required": [
          "uri"
        ],
        "properties": {
          "uri": {
            "type": "string"
          }
        }
      },
      "RaftInfo": {
        "description": "Summary information about the current raft state",
        "type": "object",
        "required": [
          "commit",
          "is_voter",
          "pending_operations",
          "term"
        ],
        "properties": {
          "term": {
            "description": "Raft divides time into terms of arbitrary length, each beginning with an election. If a candidate wins the election, it remains the leader for the rest of the term. The term number increases monotonically. Each server stores the current term number which is also exchanged in every communication.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "commit": {
            "description": "The index of the latest committed (finalized) operation that this peer is aware of.",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "pending_operations": {
            "description": "Number of consensus operations pending to be applied on this peer",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "leader": {
            "description": "Leader of the current term",
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "role": {
            "description": "Role of this peer in the current term",
            "anyOf": [
              {
                "$ref": "#/components/schemas/StateRole"
              },
              {
                "nullable": true
              }
            ]
          },
          "is_voter": {
            "description": "Is this peer a voter or a learner",
            "type": "boolean"
          }
        }
      },
      "StateRole": {
        "description": "Role of the peer in the consensus",
        "type": "string",
        "enum": [
          "Follower",
          "Candidate",
          "Leader",
          "PreCandidate"
        ]
      },
      "ConsensusThreadStatus": {
        "description": "Information about current consensus thread status",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "consensus_thread_status",
              "last_update"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "working"
                ]
              },
              "last_update": {
                "type": "string",
                "format": "date-time"
              }
            }
          },
          {
            "type": "object",
            "required": [
              "consensus_thread_status"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "stopped"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "consensus_thread_status",
              "err"
            ],
            "properties": {
              "consensus_thread_status": {
                "type": "string",
                "enum": [
                  "stopped_with_err"
                ]
              },
              "err": {
                "type": "string"
              }
            }
          }
        ]
      },
      "MessageSendErrors": {
        "description": "Message send failures for a particular peer",
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "latest_error": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "SnapshotDescription": {
        "type": "object",
        "required": [
          "name",
          "size"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "creation_time": {
            "type": "string",
            "format": "partial-date-time",
            "nullable": true
          },
          "size": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "CountRequest": {
        "description": "Count Request Counts the number of points which satisfy the given filter. If filter is not provided, the count of all points in the collection will be returned.",
        "type": "object",
        "properties": {
          "filter": {
            "description": "Look only for points which satisfies this conditions",
            "anyOf": [
              {
                "$ref": "#/components/schemas/Filter"
              },
              {
                "nullable": true
              }
            ]
          },
          "exact": {
            "description": "If true, count exact number of points. If false, count approximate number of points faster. Approximate count might be unreliable during the indexing process. Default: true",
            "default": true,
            "type": "boolean"
          }
        }
      },
      "CountResult": {
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "description": "Number of points which satisfy the conditions",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "CollectionClusterInfo": {
        "description": "Current clustering distribution for the collection",
        "type": "object",
        "required": [
          "local_shards",
          "peer_id",
          "remote_shards",
          "shard_count",
          "shard_transfers"
        ],
        "properties": {
          "peer_id": {
            "description": "ID of this peer",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "shard_count": {
            "description": "Total number of shards",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "local_shards": {
            "description": "Local shards",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/LocalShardInfo"
            }
          },
          "remote_shards": {
            "description": "Remote shards",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RemoteShardInfo"
            }
          },
          "shard_transfers": {
            "description": "Shard transfers",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ShardTransferInfo"
            }
          }
        }
      },
      "LocalShardInfo": {
        "type": "object",
        "required": [
          "points_count",
          "shard_id",
          "state"
        ],
        "properties": {
          "shard_id": {
            "description": "Local shard id",
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "points_count": {
            "description": "Number of points in the shard",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "state": {
            "$ref": "#/components/schemas/ReplicaState"
          }
        }
      },
      "ReplicaState": {
        "description": "State of the single shard within a replica set.",
        "type": "string",
        "enum": [
          "Active",
          "Dead",
          "Partial"
        ]
      },
      "RemoteShardInfo": {
        "type": "object",
        "required": [
          "peer_id",
          "shard_id",
          "state"
        ],
        "properties": {
          "shard_id": {
            "description": "Remote shard id",
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "description": "Remote peer id",
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "state": {
            "$ref": "#/components/schemas/ReplicaState"
          }
        }
      },
      "ShardTransferInfo": {
        "type": "object",
        "required": [
          "from",
          "shard_id",
          "sync",
          "to"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "from": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "to": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "sync": {
            "description": "If `true` transfer is a synchronization of a replicas If `false` transfer is a moving of a shard from one peer to another",
            "type": "boolean"
          }
        }
      },
      "TelemetryData": {
        "type": "object",
        "required": [
          "app",
          "cluster",
          "collections",
          "id",
          "requests"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "app": {
            "$ref": "#/components/schemas/AppBuildTelemetry"
          },
          "collections": {
            "$ref": "#/components/schemas/CollectionsTelemetry"
          },
          "cluster": {
            "$ref": "#/components/schemas/ClusterTelemetry"
          },
          "requests": {
            "$ref": "#/components/schemas/RequestsTelemetry"
          }
        }
      },
      "AppBuildTelemetry": {
        "type": "object",
        "required": [
          "version"
        ],
        "properties": {
          "version": {
            "type": "string"
          },
          "features": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/AppFeaturesTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "system": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/RunningEnvironmentTelemetry"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "AppFeaturesTelemetry": {
        "type": "object",
        "required": [
          "debug",
          "service_debug_feature",
          "web_feature"
        ],
        "properties": {
          "debug": {
            "type": "boolean"
          },
          "web_feature": {
            "type": "boolean"
          },
          "service_debug_feature": {
            "type": "boolean"
          }
        }
      },
      "RunningEnvironmentTelemetry": {
        "type": "object",
        "required": [
          "cpu_flags",
          "is_docker"
        ],
        "properties": {
          "distribution": {
            "type": "string",
            "nullable": true
          },
          "distribution_version": {
            "type": "string",
            "nullable": true
          },
          "is_docker": {
            "type": "boolean"
          },
          "cores": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "ram_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "disk_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          },
          "cpu_flags": {
            "type": "string"
          }
        }
      },
      "CollectionsTelemetry": {
        "type": "object",
        "required": [
          "number_of_collections"
        ],
        "properties": {
          "number_of_collections": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "collections": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CollectionTelemetryEnum"
            },
            "nullable": true
          }
        }
      },
      "CollectionTelemetryEnum": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/CollectionTelemetry"
          },
          {
            "$ref": "#/components/schemas/CollectionsAggregatedTelemetry"
          }
        ]
      },
      "CollectionTelemetry": {
        "type": "object",
        "required": [
          "config",
          "id",
          "init_time_ms",
          "shards",
          "transfers"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "init_time_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "config": {
            "$ref": "#/components/schemas/CollectionConfig"
          },
          "shards": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ReplicaSetTelemetry"
            }
          },
          "transfers": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ShardTransferInfo"
            }
          }
        }
      },
      "ReplicaSetTelemetry": {
        "type": "object",
        "required": [
          "id",
          "remote",
          "replicate_states"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "local": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/LocalShardTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "remote": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RemoteShardTelemetry"
            }
          },
          "replicate_states": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/ReplicaState"
            }
          }
        }
      },
      "LocalShardTelemetry": {
        "type": "object",
        "required": [
          "optimizations",
          "segments"
        ],
        "properties": {
          "variant_name": {
            "type": "string",
            "nullable": true
          },
          "segments": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SegmentTelemetry"
            }
          },
          "optimizations": {
            "$ref": "#/components/schemas/OptimizerTelemetry"
          }
        }
      },
      "SegmentTelemetry": {
        "type": "object",
        "required": [
          "config",
          "info",
          "payload_field_indices",
          "vector_index_searches"
        ],
        "properties": {
          "info": {
            "$ref": "#/components/schemas/SegmentInfo"
          },
          "config": {
            "$ref": "#/components/schemas/SegmentConfig"
          },
          "vector_index_searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/VectorIndexSearchesTelemetry"
            }
          },
          "payload_field_indices": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PayloadIndexTelemetry"
            }
          }
        }
      },
      "SegmentInfo": {
        "description": "Aggregated information about segment",
        "type": "object",
        "required": [
          "disk_usage_bytes",
          "index_schema",
          "is_appendable",
          "num_deleted_vectors",
          "num_points",
          "num_vectors",
          "ram_usage_bytes",
          "segment_type"
        ],
        "properties": {
          "segment_type": {
            "$ref": "#/components/schemas/SegmentType"
          },
          "num_vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "num_points": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "num_deleted_vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "ram_usage_bytes": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "disk_usage_bytes": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "is_appendable": {
            "type": "boolean"
          },
          "index_schema": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/PayloadIndexInfo"
            }
          }
        }
      },
      "SegmentType": {
        "description": "Type of segment",
        "type": "string",
        "enum": [
          "plain",
          "indexed",
          "special"
        ]
      },
      "SegmentConfig": {
        "type": "object",
        "required": [
          "index",
          "storage_type",
          "vector_data"
        ],
        "properties": {
          "vector_data": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/VectorDataConfig"
            }
          },
          "index": {
            "$ref": "#/components/schemas/Indexes"
          },
          "storage_type": {
            "$ref": "#/components/schemas/StorageType"
          },
          "payload_storage_type": {
            "$ref": "#/components/schemas/PayloadStorageType"
          }
        }
      },
      "VectorDataConfig": {
        "description": "Config of single vector data storage",
        "type": "object",
        "required": [
          "distance",
          "size"
        ],
        "properties": {
          "size": {
            "description": "Size of a vectors used",
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "distance": {
            "$ref": "#/components/schemas/Distance"
          }
        }
      },
      "Indexes": {
        "description": "Vector index configuration of the segment",
        "oneOf": [
          {
            "description": "Do not use any index, scan whole vector collection during search. Guarantee 100% precision, but may be time consuming on large collections.",
            "type": "object",
            "required": [
              "options",
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "plain"
                ]
              },
              "options": {
                "type": "object"
              }
            }
          },
          {
            "description": "Use filterable HNSW index for approximate search. Is very fast even on a very huge collections, but require additional space to store index and additional time to build it.",
            "type": "object",
            "required": [
              "options",
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "hnsw"
                ]
              },
              "options": {
                "$ref": "#/components/schemas/HnswConfig"
              }
            }
          }
        ]
      },
      "StorageType": {
        "description": "Type of vector storage",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "in_memory"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "mmap"
                ]
              }
            }
          }
        ]
      },
      "PayloadStorageType": {
        "description": "Type of payload storage",
        "oneOf": [
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "in_memory"
                ]
              }
            }
          },
          {
            "type": "object",
            "required": [
              "type"
            ],
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "on_disk"
                ]
              }
            }
          }
        ]
      },
      "VectorIndexSearchesTelemetry": {
        "type": "object",
        "required": [
          "filtered_exact",
          "filtered_large_cardinality",
          "filtered_plain",
          "filtered_small_cardinality",
          "unfiltered_exact",
          "unfiltered_hnsw",
          "unfiltered_plain"
        ],
        "properties": {
          "index_name": {
            "type": "string",
            "nullable": true
          },
          "unfiltered_plain": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "unfiltered_hnsw": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_plain": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_small_cardinality": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_large_cardinality": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "filtered_exact": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "unfiltered_exact": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "OperationDurationStatistics": {
        "type": "object",
        "required": [
          "count"
        ],
        "properties": {
          "count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "fail_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "avg_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "min_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          },
          "max_duration_micros": {
            "type": "number",
            "format": "float",
            "nullable": true
          }
        }
      },
      "PayloadIndexTelemetry": {
        "type": "object",
        "required": [
          "points_count",
          "points_values_count"
        ],
        "properties": {
          "field_name": {
            "type": "string",
            "nullable": true
          },
          "points_values_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "points_count": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "histogram_bucket_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0,
            "nullable": true
          }
        }
      },
      "OptimizerTelemetry": {
        "type": "object",
        "required": [
          "optimizations",
          "status"
        ],
        "properties": {
          "status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "optimizations": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "RemoteShardTelemetry": {
        "type": "object",
        "required": [
          "searches",
          "shard_id",
          "updates"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "searches": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          },
          "updates": {
            "$ref": "#/components/schemas/OperationDurationStatistics"
          }
        }
      },
      "CollectionsAggregatedTelemetry": {
        "type": "object",
        "required": [
          "optimizers_status",
          "params",
          "vectors"
        ],
        "properties": {
          "vectors": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "optimizers_status": {
            "$ref": "#/components/schemas/OptimizersStatus"
          },
          "params": {
            "$ref": "#/components/schemas/CollectionParams"
          }
        }
      },
      "ClusterTelemetry": {
        "type": "object",
        "required": [
          "enabled"
        ],
        "properties": {
          "enabled": {
            "type": "boolean"
          },
          "status": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ClusterStatusTelemetry"
              },
              {
                "nullable": true
              }
            ]
          },
          "config": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ClusterConfigTelemetry"
              },
              {
                "nullable": true
              }
            ]
          }
        }
      },
      "ClusterStatusTelemetry": {
        "type": "object",
        "required": [
          "commit",
          "consensus_thread_status",
          "is_voter",
          "number_of_peers",
          "pending_operations",
          "term"
        ],
        "properties": {
          "number_of_peers": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "term": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "commit": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "pending_operations": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "role": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/StateRole"
              },
              {
                "nullable": true
              }
            ]
          },
          "is_voter": {
            "type": "boolean"
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0,
            "nullable": true
          },
          "consensus_thread_status": {
            "$ref": "#/components/schemas/ConsensusThreadStatus"
          }
        }
      },
      "ClusterConfigTelemetry": {
        "type": "object",
        "required": [
          "consensus",
          "grpc_timeout_ms",
          "p2p"
        ],
        "properties": {
          "grpc_timeout_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "p2p": {
            "$ref": "#/components/schemas/P2pConfigTelemetry"
          },
          "consensus": {
            "$ref": "#/components/schemas/ConsensusConfigTelemetry"
          }
        }
      },
      "P2pConfigTelemetry": {
        "type": "object",
        "required": [
          "connection_pool_size"
        ],
        "properties": {
          "connection_pool_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          }
        }
      },
      "ConsensusConfigTelemetry": {
        "type": "object",
        "required": [
          "bootstrap_timeout_sec",
          "max_message_queue_size",
          "tick_period_ms"
        ],
        "properties": {
          "max_message_queue_size": {
            "type": "integer",
            "format": "uint",
            "minimum": 0
          },
          "tick_period_ms": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "bootstrap_timeout_sec": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "RequestsTelemetry": {
        "type": "object",
        "required": [
          "grpc",
          "rest"
        ],
        "properties": {
          "rest": {
            "$ref": "#/components/schemas/WebApiTelemetry"
          },
          "grpc": {
            "$ref": "#/components/schemas/GrpcTelemetry"
          }
        }
      },
      "WebApiTelemetry": {
        "type": "object",
        "required": [
          "responses"
        ],
        "properties": {
          "responses": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "additionalProperties": {
                "$ref": "#/components/schemas/OperationDurationStatistics"
              }
            }
          }
        }
      },
      "GrpcTelemetry": {
        "type": "object",
        "required": [
          "responses"
        ],
        "properties": {
          "responses": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/OperationDurationStatistics"
            }
          }
        }
      },
      "ClusterOperations": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/MoveShardOperation"
          },
          {
            "$ref": "#/components/schemas/ReplicateShardOperation"
          },
          {
            "$ref": "#/components/schemas/AbortTransferOperation"
          },
          {
            "$ref": "#/components/schemas/DropReplicaOperation"
          }
        ]
      },
      "MoveShardOperation": {
        "type": "object",
        "required": [
          "move_shard"
        ],
        "properties": {
          "move_shard": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "MoveShard": {
        "type": "object",
        "required": [
          "from_peer_id",
          "shard_id",
          "to_peer_id"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "to_peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          },
          "from_peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "ReplicateShardOperation": {
        "type": "object",
        "required": [
          "replicate_shard"
        ],
        "properties": {
          "replicate_shard": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "AbortTransferOperation": {
        "type": "object",
        "required": [
          "abort_transfer"
        ],
        "properties": {
          "abort_transfer": {
            "$ref": "#/components/schemas/MoveShard"
          }
        }
      },
      "DropReplicaOperation": {
        "type": "object",
        "required": [
          "drop_replica"
        ],
        "properties": {
          "drop_replica": {
            "$ref": "#/components/schemas/Replica"
          }
        }
      },
      "Replica": {
        "type": "object",
        "required": [
          "peer_id",
          "shard_id"
        ],
        "properties": {
          "shard_id": {
            "type": "integer",
            "format": "uint32",
            "minimum": 0
          },
          "peer_id": {
            "type": "integer",
            "format": "uint64",
            "minimum": 0
          }
        }
      },
      "SearchRequestBatch": {
        "type": "object",
        "required": [
          "searches"
        ],
        "properties": {
          "searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SearchRequest"
            }
          }
        }
      },
      "RecommendRequestBatch": {
        "type": "object",
        "required": [
          "searches"
        ],
        "properties": {
          "searches": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RecommendRequest"
            }
          }
        }
      },
      "LocksOption": {
        "type": "object",
        "required": [
          "write"
        ],
        "properties": {
          "error_message": {
            "type": "string",
            "nullable": true
          },
          "write": {
            "type": "boolean"
          }
        }
      },
      "SnapshotRecover": {
        "type": "object",
        "required": [
          "location"
        ],
        "properties": {
          "location": {
            "description": "Examples: - URL `http://localhost:8080/collections/my_collection/snapshots/my_snapshot` - Local path `file:///qdrant/snapshots/test_collection-2022-08-04-10-49-10.snapshot`",
            "type": "string",
            "format": "uri"
          },
          "priority": {
            "$ref": "#/components/schemas/SnapshotPriority"
          }
        }
      },
      "SnapshotPriority": {
        "description": "Defines source of truth for snapshot recovery `Snapshot` means - prefer snapshot data over the current state `Replica` means - prefer existing data over the snapshot",
        "type": "string",
        "enum": [
          "snapshot",
          "replica"
        ]
      }
    }
  }
}



---
File: /docs/redoc/default_version.js
---

const defaultApiVersion = 'v1.12.x';



---
File: /docs/redoc/index.html
---

<!DOCTYPE html>
<html>
<head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
        body {
            margin: 0;
            padding: 0;
        }
    </style>
    <script src="./default_version.js"></script>

    <script>
        const url_string = window.location.href;
        const url = new URL(url_string);
        const version = url.searchParams.get("v") || defaultApiVersion;
    </script>
</head>
<body>
<nav class="navbar navbar-light justify-content-between" style="background-color: rgb(250, 250, 250);">
    <a class="navbar-brand" href="#">
        <img src="../logo.svg" height="30">
    </a>

    <div class="btn-group">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
            Version
        </button>
        <div class="dropdown-menu dropdown-menu-right">
            <a href="?v=master" class="dropdown-item" type="button">master</a>
            <a href="?v=v1.12.x" class="dropdown-item" type="button">v1.12.x</a>
            <a href="?v=v1.11.x" class="dropdown-item" type="button">v1.11.x</a>
            <a href="?v=v1.10.x" class="dropdown-item" type="button">v1.10.x</a>
            <a href="?v=v1.9.x" class="dropdown-item" type="button">v1.9.x</a>
            <a href="?v=v1.8.x" class="dropdown-item" type="button">v1.8.x</a>
            <a href="?v=v1.7.x" class="dropdown-item" type="button">v1.7.x</a>
            <a href="?v=v1.6.x" class="dropdown-item" type="button">v1.6.x</a>
            <a href="?v=v1.5.x" class="dropdown-item" type="button">v1.5.x</a>
            <a href="?v=v1.4.x" class="dropdown-item" type="button">v1.4.x</a>
            <a href="?v=v1.3.x" class="dropdown-item" type="button">v1.3.x</a>
            <a href="?v=v1.2.x" class="dropdown-item" type="button">v1.2.x</a>
            <a href="?v=v1.1.3" class="dropdown-item" type="button">v1.1.3</a>
            <a href="?v=v1.1.2" class="dropdown-item" type="button">v1.1.2</a>
            <a href="?v=v1.1.1" class="dropdown-item" type="button">v1.1.1</a>
            <a href="?v=v1.1.0" class="dropdown-item" type="button">v1.1.0</a>
            <a href="?v=v1.0.3" class="dropdown-item" type="button">v1.0.3</a>
            <a href="?v=v1.0.2" class="dropdown-item" type="button">v1.0.2</a>
            <a href="?v=v1.0.1" class="dropdown-item" type="button">v1.0.1</a>
            <a href="?v=v0.11.7" class="dropdown-item" type="button">v0.11.7</a>
        </div>
    </div>

</nav>

<redoc id="redoc-container" spec-url='./openapi.json' theme='
{
    "colors": {
        "primary": {
            "main": "#bc1439"
        }
    },
    "rightPanel": {
        "backgroundColor": "#182b3a"
    },
    "codeBlock": {
        "backgroundColor": "#182b3a"
    }
}
'></redoc>

<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
        integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"></script>

<script>
    $('#redoc-container').attr("spec-url", "./" + version + "/openapi.json");
</script>

<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>

</body>
</html>



---
File: /docs/roadmap/README.md
---

# Qdrant 2024 Roadmap

Hi!
This document is our plan for Qdrant development in 2024.
Previous year roadmap is available here:

* [Roadmap 2023](roadmap-2023.md)
* [Roadmap 2022](roadmap-2022.md)

Goals of the release:

* **Maintain easy upgrades** - we plan to keep backward compatibility for at least one minor version back (this stays the same in 2024).
  * That means that you can upgrade Qdrant without any downtime and without any changes in your client code within one minor version.
  * Storage should be compatible between any two consequent versions, so you can upgrade Qdrant with automatic data migration between consecutive versions.
* **Make serving easy on multi-billion scale** - Qdrant already can serve billions of vectors cheaply, using techniques as quantization. In the 2024 year, we plan to make it even easier to scale it.
  * Faster and more reliable replications
  * Out-of-the-box read-write segregation
  * Specialized nodes and multi-region deployments
* **Better ecosystem** - in 2023 we introduced [fastembed](https://github.com/qdrant/fastembed) to simplify embedding generation but keep it out of the core.
  In 2024 we plan to continue this trend: implement more advanced and specialized tools while keeping the core focused on the main use-case.
  * Advanced support for sparse vectors - we plan to make sparse vectors inference as fast and easy as the dense one.
  * Hybrid search out of the box with no overhead - something you can build with Qdrant today, but in a more convenient way.
  * Practical RAG - battle-tested RAG practices with production-grade implementation.
* **Various similarity search scenarios** - develop vector similarity beyond just kNN search.

## How to contribute

If you are a Qdrant user - Data Scientist, ML Engineer, or MLOps, the best contribution would be the feedback on your experience with Qdrant.
Let us know whenever you have a problem, face an unexpected behavior, or see a lack of documentation.
You can do it in any convenient way - create an [issue](https://github.com/qdrant/qdrant/issues), start a [discussion](https://github.com/qdrant/qdrant/discussions), or drop up a [message](https://discord.gg/tdtYvXjC4h).
If you use Qdrant or Metric Learning in your projects, we'd love to hear your story! Feel free to share articles and demos in our community.

For those familiar with Rust - check out our [contribution guide](../CONTRIBUTING.md).
If you have problems with code or architecture understanding - reach us at any time.
Feeling confident and want to contribute more? - Come to [work with us](https://qdrant.join.com/)!

## Core Milestones

* 📃 Hybrid Search and Sparse Vectors
  * [x] Make Sparse Vectors serving as cheap and fast as Dense Vectors
  * [x] Introduce Hybrid Search into Qdrant Client
    * [x] Dense + Sparse + Fusion in one request
    * [ ] Customizable Re-Ranking

---

* 🏗️ Scalability
  * [x] Faster shard synchronization
    * [x] Non-blocking snapshotting
    * [x] Incremental replication
  * [ ] Specialized nodes
    * [ ] Read-only nodes
    * [ ] Indexing nodes
  * [ ] Multi-region deployments
    * [ ] Automatic replication over availability zones

---

* ⚙️ Performance
  * [ ] Specialized vector indexing for edge cases HNSW is not good at
  * [ ] Text-index performance and resource consumption improvements
  * [ ] IO optimizations for disk-bound workloads

---

* 🏝️ New Data Exploration techniques
  * [ ] Improvements in Discovery API to support more use-cases
  * [ ] Diversity Sampling
  * [ ] Better Aggregations
  * [ ] Advanced text filtering
    * [ ] Phrase queries
    * [ ] Logical operators



---
File: /docs/roadmap/roadmap-2022.md
---

# Roadmap 2022

This document describes what features and milestones were planned and achieved in 2022.

The main goals for the 2022 year were:

* **Make API and Storage stable** - ensure backward compatibility for at least one major version back.
    * Starting from the release, breaking changes in API should only be done with a proper deprecation notice
    * Storage should be compatible between any two consequent major versions
* **Achieve horizontal scalability** - distributed deployment able to serve billions of points
* **Easy integration** - make the user experience as smooth as possible
* **Resource efficiency** - push Qdrant performance on the single machine to the limit


## Milestones

* :earth_americas: Distributed Deployment
    * [x] Distributed querying
    * [x] Integration of [raft](https://raft.github.io/) for distributed consistency
    * [x] Sharding - group segments into shards
    * [x] Cluster scaling
    * [x] Replications - automatic segment replication between nodes in cluster

---

* :electric_plug: Integration & Interfaces
    * [x] gPRC version of each REST API endpoint
    * [x] Split REST Endpoints for better documentation and client generation

---

* :truck: Payload Processing
    * [x] Support storing any JSON as a Payload
    * [ ] ~~Support more payload types, e.g.~~
        * ~~Data-time~~
    * [x] Support for `Null` values
    * [x] Enable more types of filtering queries, e.g.
        * [x] Filter by Score
        * [x] Filter by number of stored elements
        * [x] `isNull` or `isEmpty` query conditions


* Additionally
    * [x] Full-text filtering support
    * [x] Multiple vectors per record support

---

* :racing_car: Performance improvements
    * [x] Indexing of geo-payload
    * [x] On the fly payload index
    * [x] Multiprocessing segment optimization
    * [x] Fine-tuned HNSW index configuration




---
File: /docs/roadmap/roadmap-2023.md
---

# Qdrant 2023 Roadmap

Hi!
This document is our plan for Qdrant development in 2023.
Previous year roadmap is available here:

* [Roadmap 2022](roadmap-2022.md)

Goals of the release:

* **Maintain easy upgrades** - we plan to keep backward compatibility for at least one minor version back.
  * That means that you can upgrade Qdrant without any downtime and without any changes in your client code within one minor version.
  * Storage should be compatible between any two consequent versions, so you can upgrade Qdrant with automatic data migration between consecutive versions.
* **Make billion-scale serving cheap** - qdrant already can serve billions of vectors, but we want to make it even more affordable.
* **Easy scaling** - our plan is to make it easy to dynamically scale Qdrant, so you could go from 1 to 1B vectors seamlessly.
* **Various similarity search scenarios** - we want to support more similarity search scenarios, e.g. sparse search, grouping requests, diverse search, etc.

## How to contribute

If you are a Qdrant user - Data Scientist, ML Engineer, or MLOps, the best contribution would be the feedback on your experience with Qdrant.
Let us know whenever you have a problem, face an unexpected behavior, or see a lack of documentation.
You can do it in any convenient way - create an [issue](https://github.com/qdrant/qdrant/issues), start a [discussion](https://github.com/qdrant/qdrant/discussions), or drop up a [message](https://discord.gg/tdtYvXjC4h).
If you use Qdrant or Metric Learning in your projects, we'd love to hear your story! Feel free to share articles and demos in our community.

For those familiar with Rust - check out our [contribution guide](../CONTRIBUTING.md).
If you have problems with code or architecture understanding - reach us at any time.
Feeling confident and want to contribute more? - Come to [work with us](https://qdrant.join.com/)!

## Milestones

* :atom_symbol: Quantization support
  * [x] Scalar quantization f32 -> u8 (4x compression)
  * [x] Product quantization (4x, 8x, 16x, 32x, and 64x compression)
  * [x] Binary quantization (32x compression, 40x speedup)
  * [x] Support for binary vectors

---

* :arrow_double_up: Scalability
  * [ ] Automatic replication factor adjustment
  * [ ] Automatic shard distribution on cluster scaling
  * [x] Repartitioning support

---

* :eyes: Search scenarios
  * [ ] Diversity search - search for vectors that are different from each other
  * [x] Discovery search - constrain the space in which the search is performed
  * [x] Sparse vectors search - search for vectors with a small number of non-zero values
  * [x] Grouping requests - search within payload-defined groups
  * [x] Different scenarios for recommendation API

---

* Additionally
  * [ ] Extend full-text filtering support
    * [ ] Support for phrase queries
    * [ ] Support for logical operators
  * [x] Simplify update of collection parameters



---
File: /docs/CODE_OF_CONDUCT.md
---

# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, religion, or sexual identity
and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
* Focusing on what is best not just for us as individuals, but for the
  overall community

Examples of unacceptable behavior include:

* The use of sexualized language or imagery, and sexual attention or
  advances of any kind
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or email
  address, without their explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
email: andrey@vasnetsov.com.
All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact**: A violation through a single incident or series
of actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or
permanent ban.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior,  harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within
the community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.0, available at
https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.

Community Impact Guidelines were inspired by [Mozilla's code of conduct
enforcement ladder](https://github.com/mozilla/diversity).

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see the FAQ at
https://www.contributor-covenant.org/faq. Translations are available at
https://www.contributor-covenant.org/translations.



---
File: /docs/CONTRIBUTING.md
---

# Contributing to Qdrant
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with GitHub
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [GitHub Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `dev`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation and API Schema definitions (see [development docs](https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md#api-changes))
4. Ensure the test suite passes.
5. Make sure your code lints (with cargo).
6. Issue that pull request!

## Any contributions you make will be under the Apache License 2.0
In short, when you submit code changes, your submissions are understood to be under the same [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issues](https://github.com/qdrant/qdrant/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/qdrant/qdrant/issues/new/choose); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

If you are modifying Rust code, make sure it has no warnings from Cargo and follow [Rust code style](https://doc.rust-lang.org/1.0.0/style/).
The project uses [rustfmt](https://github.com/rust-lang/rustfmt) formatter. Please ensure to run it using the
```cargo +nightly fmt --all``` command. The project also use [clippy](https://github.com/rust-lang/rust-clippy) lint collection,
so please ensure running ``cargo clippy --workspace --all-features`` before submitting the PR.

## License
By contributing, you agree that your contributions will be licensed under its Apache License 2.0.




---
File: /docs/DEVELOPMENT.md
---


# Developer's guide to Qdrant


## Build Qdrant

### Docker 🐳

Build your own from source

```bash
docker build . --tag=qdrant/qdrant
```

Or use latest pre-built image from [DockerHub](https://hub.docker.com/r/qdrant/qdrant)

```bash
docker pull qdrant/qdrant
```

To run the container, use the command:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

And once you need a fine-grained setup, you can also define a storage path and custom configuration:

```bash
docker run -p 6333:6333 \
    -v $(pwd)/path/to/data:/qdrant/storage \
    -v $(pwd)/path/to/snapshots:/qdrant/snapshots \
    -v $(pwd)/path/to/custom_config.yaml:/qdrant/config/production.yaml \
    qdrant/qdrant
```

* `/qdrant/storage` - is the place where Qdrant persists all your data.
Make sure to mount it as a volume, otherwise docker will drop it with the container.
- `/qdrant/snapshots` - is the place where Qdrant stores [snapshots](https://qdrant.tech/documentation/concepts/snapshots/)
* `/qdrant/config/production.yaml` - is the file with engine configuration. You can override any value from the [reference config](https://github.com/qdrant/qdrant/blob/master/config/config.yaml)

Now Qdrant should be accessible at [localhost:6333](http://localhost:6333/).


### Local development
#### Linux/Debian/MacOS
To run Qdrant on local development environment you need to install below:
- Install Rust, follow: [install rust](https://www.rust-lang.org/tools/install)
- Install `rustfmt` toolchain for Rust
    ```shell
    rustup component add rustfmt
    ```
- Install dependencies:
    ```shell
    sudo apt-get update -y
    sudo apt-get upgrade -y
    sudo apt-get install -y curl unzip gcc-multilib \
        clang cmake jq \
        g++-9-aarch64-linux-gnu \
        gcc-9-aarch64-linux-gnu
    ```
- Install `protoc` from source
    ```shell
    PROTOC_VERSION=22.2
    PKG_NAME=$(uname -s | awk '{print ($1 == "Darwin") ? "osx-universal_binary" : (($1 == "Linux") ? "linux-x86_64" : "")}')

    # curl `proto` source file
    curl -LO https://github.com/protocolbuffers/protobuf/releases//download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-$PKG_NAME.zip

    unzip protoc-$PROTOC_VERSION-$PKG_NAME.zip -d $HOME/.local

    export PATH="$PATH:$HOME/.local/bin"

    # remove source file if not needed
    rm protoc-$PROTOC_VERSION-$PKG_NAME.zip

    # check installed `protoc` version
    protoc --version
    ```
- Build and run the app
    ```shell
    cargo build --release --bin qdrant

    ./target/release/qdrant
    ```
- Install Python dependencies for testing
    ```shell
    poetry -C tests install --sync
    ```
    Then you could use `poetry -C run pytest tests/openapi` and `poetry -C run pytest tests/consensus_tests` to run the tests.
- Use the web UI

    Web UI repo is [in a separate repo](https://github.com/qdrant/qdrant-web-ui), but there's a utility script to sync it to the `static` folder:
    ```shell
    ./tools/sync-web-ui.sh
    ```

### Nix/NixOS
If you are using [Nix package manager](https://nixos.org/) (available for Linux and MacOS), you can run `nix-shell` in the project root to get a shell with all dependencies installed.
It includes dependencies to build Rust code as well as to run Python tests and various tools in the `./tools` directory.

## Profiling

There are several benchmarks implemented in Qdrant. Benchmarks are not included in CI/CD and might take some time to execute.
So the expected approach to benchmarking is to run only ones which might be affected by your changes.

To run benchmark, use the following command inside a related sub-crate:

```bash
cargo bench --bench name_of_benchmark
```

In this case you will see the execution timings and, if you launched this bench earlier, the difference in execution time.

Example output:

```
scoring-vector/basic-score-point
                        time:   [111.81 us 112.07 us 112.31 us]
                        change: [+19.567% +20.454% +21.404%] (p = 0.00 < 0.05)
                        Performance has regressed.
Found 9 outliers among 100 measurements (9.00%)
  3 (3.00%) low severe
  3 (3.00%) low mild
  2 (2.00%) high mild
  1 (1.00%) high severe
scoring-vector/basic-score-point-10x
                        time:   [111.86 us 112.44 us 113.04 us]
                        change: [-1.6120% -0.5554% +0.5103%] (p = 0.32 > 0.05)
                        No change in performance detected.
Found 1 outliers among 100 measurements (1.00%)
  1 (1.00%) high mild
```


### FlameGraph and call-graph visualisation
To run benchmarks with profiler to generate FlameGraph - use the following command:

```bash
cargo bench --bench name_of_benchmark -- --profile-time=60
```

This command will run each benchmark iterator for `60` seconds and generate FlameGraph svg along with profiling records files.
These records could later be used to generate visualisation of the call-graph.

![FlameGraph example](./imgs/flamegraph-profile.png)

Use [pprof](https://github.com/google/pprof) and the following command to generate `svg` with a call graph:

```bash
~/go/bin/pprof -output=profile.svg -svg ${qdrant_root}/target/criterion/${benchmark_name}/${function_name}/profile/profile.pb
```

![call-graph example](./imgs/call-graph-profile.png)

### Real-time profiling

Qdrant have basic [`tracing`] support with [`Tracy`] profiler and [`tokio-console`] integrations
that can be enabled with optional features.

- [`tracing`] is an _optional_ dependency that can be enabled with `tracing` feature
- `tracy` feature enables [`Tracy`] profiler integration
- `console` feature enables [`tokio-console`] integration
  - note, that you'll also have to [pass `--cfg tokio_unstable` arguments to `rustc`][tokio-tracing] to enable this feature
  - by default [`tokio-console`] binds to `127.0.0.1:6669`
  - if you want to connect [`tokio-console`] to Qdrant instance running inside a Docker container
    or on remote server, you can define `TOKIO_CONSOLE_BIND` when running Qdrant to override it
    (e.g., `TOKIO_CONSOLE_BIND=0.0.0.0:6669` to listen on all interfaces)
- `tokio-tracing` feature explicitly enables [`Tokio` crate tracing][tokio-tracing]
  - note, that you'll also have to [pass `--cfg tokio_unstable` arguments to `rustc`][tokio-tracing] to enable this feature
  - this is required (and enabled automatically) by the `console` feature
  - but you can enable it explicitly with the `tracy` feature, to see Tokio traces in [`Tracy`] profiler

Qdrant code is **not** instrumented by default, so you'll have to manually add `#[tracing::instrument]` attributes
on functions and methods that you want to profile.

Qdrant uses [`tracing-log`] as the [`log`] backend, so `log` and `log-always` features of the [`tracing`] crate
[should _not_ be enabled][tracing-log-warning]!

```rust
// `tracing` crate is an *optional* dependency in `lib/*` crates, so if you want the code to compile
// when `tracing` feature is disabled, you have to use `#[cfg_attr(...)]`...
//
// See https://doc.rust-lang.org/reference/conditional-compilation.html#the-cfg_attr-attribute
#[cfg_attr(feature = "tracing", tracing::instrument)]
fn my_function(some_parameter: String) {
    // ...
}

// ...or if you just want to do some quick-and-dirty profiling, you can use `#[tracing::instrument]`
// directly, just don't forget to add `--features tracing` when running `cargo` (or add `tracing`
// to default features in `Cargo.toml`)
#[tracing::instrument]
fn some_other_function() {
    // ...
}
```

[`tracing`]: https://docs.rs/tracing/latest/tracing/
[`Tracy`]: https://github.com/wolfpld/tracy
[`tokio-console`]: https://docs.rs/tokio-console/latest/tokio_console/
[tokio-tracing]: https://docs.rs/tokio/latest/tokio/#unstable-features
[`tracing-log`]: https://docs.rs/tracing-log/latest/tracing_log/
[`log`]: https://docs.rs/log/latest/log/
[tracing-log-warning]: https://docs.rs/tracing-log/latest/tracing_log/#caution-mixing-both-conversions

## API changes

### REST

Qdrant uses the [openapi](https://spec.openapis.org/oas/latest.html) specification to document its API.

This means changes to the API must be followed by changes to the specification.
This is enforced by CI.

Here is a quick step-by-step guide:

1. code endpoints and model in Rust
2. change specs in `/openapi/*ytt.yaml`
3. add new schema definitions to `src/schema_generator.rs`
4. run `./tools/generate_openapi_models.sh` to generate specs
5. update integration tests `tests/openapi` and run them with `pytest tests/openapi` (use poetry or nix to get `pytest`)
6. expose file by starting an HTTP server, for instance `python -m http.server`, in `/docs/redoc`
7. validate specs by browsing redoc on `http://localhost:8000/?v=master`
8. validate `openapi-merged.yaml` using [swagger editor](https://editor.swagger.io/)

### gRPC

Qdrant uses [tonic](https://github.com/hyperium/tonic) to serve gRPC traffic.

Our protocol buffers are defined in `lib/api/src/grpc/proto/*.proto`

1. define request and response types using protocol buffers (use [oneOf](https://developers.google.com/protocol-buffers/docs/proto3#oneof) for enums payloads)
2. specify RPC methods inside the service definition using protocol buffers
3. `cargo build` will generate the struct definitions and a service trait
4. implement the service trait in Rust
5. start server `cargo run --bin qdrant`
6. run integration test `./tests/basic_grpc_test.sh`
7. generate docs `./tools/generate_grpc_docs.sh`

Here is a good [tonic tutorial](https://github.com/hyperium/tonic/blob/master/examples/routeguide-tutorial.md#defining-the-service) for reference.

### System integration

On top of the API definitions, Qdrant has a few system integrations that need to be considered when making changes:
1. add new endpoints to the metrics allow lists in `src/common/metrics.rs`
2. test the JWT integration in `tests/auth_tests`


---
File: /docs/QUICK_START.md
---

# Quick Start

This example covers the most basic use-case - collection creation and basic vector search.
For additional information please refer to the [API documentation](https://api.qdrant.tech/).

## Docker 🐳

Use latest pre-built image from [DockerHub](https://hub.docker.com/r/qdrant/qdrant)

```bash
docker pull qdrant/qdrant
```

Run it with default configuration:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Build your own from source

```bash
docker build . --tag=qdrant/qdrant
```

And once you need a fine-grained setup, you can also define a storage path and custom configuration:

```bash
docker run -p 6333:6333 \
    -v $(pwd)/path/to/data:/qdrant/storage \
    -v $(pwd)/path/to/snapshots:/qdrant/snapshots \
    -v $(pwd)/path/to/custom_config.yaml:/qdrant/config/production.yaml \
    qdrant/qdrant
```

- `/qdrant/storage` - is the place where Qdrant persists all your data.
  Make sure to mount it as a volume, otherwise docker will drop it with the container.
- `/qdrant/snapshots` - is the place where Qdrant stores [snapshots](https://qdrant.tech/documentation/concepts/snapshots/)
- `/qdrant/config/production.yaml` - is the file with engine configuration. You can override any value from the [reference config](https://github.com/qdrant/qdrant/blob/master/config/config.yaml). In a real production environment, you should enable authentication by setting `service.apiKey`.
- For production environments, consider also setting [`--read-only`](https://docs.docker.com/reference/cli/docker/container/run/#read-only) and `--user=1000:2000` to further secure your Qdrant instance. Or use [our Helm chart](https://github.com/qdrant/qdrant-helm) or [Qdrant Cloud](https://qdrant.tech/documentation/cloud/) which sets these by default.

Now Qdrant should be accessible at [localhost:6333](http://localhost:6333/).

## Create collection

First - let's create a collection with dot-production metric.

```bash
curl -X PUT 'http://localhost:6333/collections/test_collection' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "vectors": {
          "size": 4,
          "distance": "Dot"
        }
    }'
```

Expected response:

```json
{
  "result": true,
  "status": "ok",
  "time": 0.031095451
}
```

We can ensure that collection was created:

```bash
curl 'http://localhost:6333/collections/test_collection'
```

Expected response:

```json
{
  "result": {
    "status": "green",
    "vectors_count": 0,
    "segments_count": 5,
    "disk_data_size": 0,
    "ram_data_size": 0,
    "config": {
      "params": {
        "vectors": {
          "size": 4,
          "distance": "Dot"
        }
      },
      "hnsw_config": {
        "m": 16,
        "ef_construct": 100,
        "full_scan_threshold": 10000
      },
      "optimizer_config": {
        "deleted_threshold": 0.2,
        "vacuum_min_vector_number": 1000,
        "default_segment_number": 2,
        "max_segment_size": null,
        "memmap_threshold": null,
        "indexing_threshold": 20000,
        "flush_interval_sec": 5,
        "max_optimization_threads": null
      },
      "wal_config": {
        "wal_capacity_mb": 32,
        "wal_segments_ahead": 0
      }
    }
  },
  "status": "ok",
  "time": 2.1199e-5
}
```

## Add points

Let's now add vectors with some payload:

```bash
curl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "points": [
          {"id": 1, "vector": [0.05, 0.61, 0.76, 0.74], "payload": {"city": "Berlin"}},
          {"id": 2, "vector": [0.19, 0.81, 0.75, 0.11], "payload": {"city": ["Berlin", "London"] }},
          {"id": 3, "vector": [0.36, 0.55, 0.47, 0.94], "payload": {"city": ["Berlin", "Moscow"] }},
          {"id": 4, "vector": [0.18, 0.01, 0.85, 0.80], "payload": {"city": ["London", "Moscow"] }},
          {"id": 5, "vector": [0.24, 0.18, 0.22, 0.44], "payload": {"count": [0] }},
          {"id": 6, "vector": [0.35, 0.08, 0.11, 0.44]}
        ]
    }'
```

Expected response:

```json
{
  "result": {
    "operation_id": 0,
    "status": "completed"
  },
  "status": "ok",
  "time": 0.000206061
}
```

## Search with filtering

Let's start with a basic request:

```bash
curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "vector": [0.2,0.1,0.9,0.7],
        "top": 3
    }'
```

Expected response:

```json
{
  "result": [
    { "id": 4, "score": 1.362, "payload": null, "version": 0 },
    { "id": 1, "score": 1.273, "payload": null, "version": 0 },
    { "id": 3, "score": 1.208, "payload": null, "version": 0 }
  ],
  "status": "ok",
  "time": 0.000055785
}
```

But result is different if we add a filter:

```bash
curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \
    -H 'Content-Type: application/json' \
    --data-raw '{
      "filter": {
          "should": [
              {
                  "key": "city",
                  "match": {
                      "value": "London"
                  }
              }
          ]
      },
      "vector": [0.2, 0.1, 0.9, 0.7],
      "top": 3
  }'
```

Expected response:

```json
{
  "result": [
    { "id": 4, "score": 1.362 },
    { "id": 2, "score": 0.871 }
  ],
  "status": "ok",
  "time": 0.000093972
}
```

