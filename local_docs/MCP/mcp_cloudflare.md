Directory Structure:

└── ./
    └── mcp-server-cloudflare-main
        ├── src
        │   ├── tools
        │   │   ├── analytics.ts
        │   │   ├── d1.ts
        │   │   ├── kv.ts
        │   │   ├── r2.ts
        │   │   └── workers.ts
        │   ├── utils
        │   │   ├── c3.ts
        │   │   ├── helpers.ts
        │   │   ├── types.ts
        │   │   └── wrangler.ts
        │   ├── index.ts
        │   ├── init.ts
        │   └── main.ts
        ├── package.json
        ├── pnpm-lock.yaml
        ├── README.md
        └── tsconfig.json



---
File: /mcp-server-cloudflare-main/src/tools/analytics.ts
---

import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { fetch } from 'undici'
import { config } from '../utils/helpers'
import { ToolHandlers } from '../utils/types'

const ANALYTICS_GET_TOOL: Tool = {
  name: 'analytics_get',
  description: 'Get analytics data from Cloudflare',
  inputSchema: {
    type: 'object',
    properties: {
      zoneId: {
        type: 'string',
        description: 'The zone ID to get analytics for',
      },
      since: {
        type: 'string',
        description: 'Start time for analytics (ISO string)',
      },
      until: {
        type: 'string',
        description: 'End time for analytics (ISO string)',
      },
    },
    required: ['zoneId'],
  },
}

export const ANALYTICS_TOOLS = [ANALYTICS_GET_TOOL]

export const ANALYTICS_HANDLERS: ToolHandlers = {
  analytics_get: async (request) => {
    const { zoneId, since, until } = request.params.arguments as {
      zoneId: string
      since?: string
      until?: string
    }
    const date = since ? new Date(since).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

    const graphqlQuery = {
      query: `query {
              viewer {
                  zones(filter: {zoneTag: "${zoneId}"}) {
                      httpRequests1dGroups(
                          limit: 1,
                          filter: {date: "${date}"},
                          orderBy: [date_DESC]
                      ) {
                          dimensions {
                              date
                          }
                          sum {
                              requests
                              bytes
                              threats
                              pageViews
                          }
                          uniq {
                              uniques
                          }
                      }
                  }
              }
          }`,
    }

    const analyticsResponse = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })

    if (!analyticsResponse.ok) {
      throw new Error(`Analytics API error: ${await analyticsResponse.text()}`)
    }

    const analyticsData = await analyticsResponse.json()
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analyticsData, null, 2),
          },
        ],
      },
    }
  },
}



---
File: /mcp-server-cloudflare-main/src/tools/d1.ts
---

// Add D1 tool definitions
import { config, log } from '../utils/helpers'
import { fetch } from 'undici'
import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types'

const D1_LIST_DATABASES_TOOL: Tool = {
  name: 'd1_list_databases',
  description: 'List all D1 databases in your account',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}
const D1_CREATE_DATABASE_TOOL: Tool = {
  name: 'd1_create_database',
  description: 'Create a new D1 database',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the database to create',
      },
    },
    required: ['name'],
  },
}
const D1_DELETE_DATABASE_TOOL: Tool = {
  name: 'd1_delete_database',
  description: 'Delete a D1 database',
  inputSchema: {
    type: 'object',
    properties: {
      databaseId: {
        type: 'string',
        description: 'ID of the database to delete',
      },
    },
    required: ['databaseId'],
  },
}
const D1_QUERY_TOOL: Tool = {
  name: 'd1_query',
  description: 'Execute a SQL query against a D1 database',
  inputSchema: {
    type: 'object',
    properties: {
      databaseId: {
        type: 'string',
        description: 'ID of the database to query',
      },
      query: {
        type: 'string',
        description: 'SQL query to execute',
      },
      params: {
        type: 'array',
        description: 'Optional array of parameters for prepared statements',
        items: {
          type: 'string',
        },
      },
    },
    required: ['databaseId', 'query'],
  },
}
// Add D1 tools to ALL_TOOLS
export const D1_TOOLS = [D1_LIST_DATABASES_TOOL, D1_CREATE_DATABASE_TOOL, D1_DELETE_DATABASE_TOOL, D1_QUERY_TOOL]

// Add D1 response interfaces
interface CloudflareD1DatabasesResponse {
  result: Array<{
    uuid: string
    name: string
    version: string
    created_at: string
    updated_at: string
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

interface CloudflareD1QueryResponse {
  result: Array<any>
  success: boolean
  errors?: any[]
  messages?: any[]
  meta?: {
    changed_db: boolean
    changes?: number
    duration: number
    last_row_id?: number
    rows_read?: number
    rows_written?: number
  }
}

// Add D1 handlers
export async function handleD1ListDatabases() {
  log('Executing d1_list_databases')
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list D1 databases: ${error}`)
  }

  const data = (await response.json()) as CloudflareD1DatabasesResponse
  return data.result
}

export async function handleD1CreateDatabase(name: string) {
  log('Executing d1_create_database:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create D1 database: ${error}`)
  }

  const data = (await response.json()) as CloudflareD1DatabasesResponse
  return data.result
}

export async function handleD1DeleteDatabase(databaseId: string) {
  log('Executing d1_delete_database:', databaseId)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${databaseId}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete D1 database: ${error}`)
  }

  return 'Success'
}

export async function handleD1Query(databaseId: string, query: string, params?: string[]) {
  log('Executing d1_query for database:', databaseId)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${databaseId}/query`

  const body = {
    sql: query,
    params: params || [],
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to execute D1 query: ${error}`)
  }

  const data = (await response.json()) as CloudflareD1QueryResponse
  return {
    result: data.result,
    meta: data.meta,
  }
}

export const D1_HANDLERS: ToolHandlers = {
  // Add D1 cases to the tool call handler
  d1_list_databases: async (request) => {
    const results = await handleD1ListDatabases()
    return {
      toolResult: {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      },
    }
  },

  d1_create_database: async (request) => {
    const { name } = request.params.arguments as { name: string }
    const result = await handleD1CreateDatabase(name)
    return {
      toolResult: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      },
    }
  },

  d1_delete_database: async (request) => {
    const { databaseId } = request.params.arguments as { databaseId: string }
    await handleD1DeleteDatabase(databaseId)
    return {
      toolResult: {
        content: [{ type: 'text', text: `Successfully deleted database: ${databaseId}` }],
      },
    }
  },

  d1_query: async (request) => {
    const { databaseId, query, params } = request.params.arguments as {
      databaseId: string
      query: string
      params?: string[]
    }
    const result = await handleD1Query(databaseId, query, params)
    return {
      toolResult: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      },
    }
  },
}



---
File: /mcp-server-cloudflare-main/src/tools/kv.ts
---

import { config, log } from '../utils/helpers'
import { fetch } from 'undici'
import { ToolHandlers } from '../utils/types'
import { Tool } from '@modelcontextprotocol/sdk/types.js'

interface CloudflareListResponse {
  result: Array<{
    name: string
    expiration?: number
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

// Add the new KV list namespaces tool definition
const GET_KVS_TOOL: Tool = {
  name: 'get_kvs',
  description: 'List KV namespaces in your account',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}
// Modify existing KV tool definitions to include namespaceId
const KV_GET_TOOL: Tool = {
  name: 'kv_get',
  description: 'Get a value from Cloudflare KV store',
  inputSchema: {
    type: 'object',
    properties: {
      namespaceId: {
        type: 'string',
        description: 'The KV namespace ID',
      },
      key: {
        type: 'string',
        description: 'The key to retrieve',
      },
    },
    required: ['namespaceId', 'key'],
  },
}
const KV_PUT_TOOL: Tool = {
  name: 'kv_put',
  description: 'Put a value into Cloudflare KV store',
  inputSchema: {
    type: 'object',
    properties: {
      namespaceId: {
        type: 'string',
        description: 'The KV namespace ID',
      },
      key: {
        type: 'string',
        description: 'The key to store',
      },
      value: {
        type: 'string',
        description: 'The value to store',
      },
      expirationTtl: {
        type: 'number',
        description: 'Optional expiration time in seconds',
      },
    },
    required: ['namespaceId', 'key', 'value'],
  },
}
const KV_DELETE_TOOL: Tool = {
  name: 'kv_delete',
  description: 'Delete a key from Cloudflare KV store',
  inputSchema: {
    type: 'object',
    properties: {
      namespaceId: {
        type: 'string',
        description: 'The KV namespace ID',
      },
      key: {
        type: 'string',
        description: 'The key to delete',
      },
    },
    required: ['namespaceId', 'key'],
  },
}
const KV_LIST_TOOL: Tool = {
  name: 'kv_list',
  description: 'List keys in Cloudflare KV store',
  inputSchema: {
    type: 'object',
    properties: {
      namespaceId: {
        type: 'string',
        description: 'The KV namespace ID',
      },
      prefix: {
        type: 'string',
        description: 'Optional prefix to filter keys',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of keys to return',
      },
    },
    required: ['namespaceId'],
  },
}
export const KV_TOOLS = [GET_KVS_TOOL, KV_GET_TOOL, KV_PUT_TOOL, KV_DELETE_TOOL, KV_LIST_TOOL]

// Add interface for KV namespace response
interface CloudflareKVNamespacesResponse {
  result: Array<{
    id: string
    title: string
    supports_url_encoding?: boolean
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

// Add handler for getting KV namespaces
export async function handleGetKVs() {
  log('Executing get_kvs')
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('KV namespaces response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('KV namespaces error:', error)
    throw new Error(`Failed to list KV namespaces: ${error}`)
  }

  const data = (await response.json()) as CloudflareKVNamespacesResponse
  log('KV namespaces success:', data)
  return data.result
}

// Modify existing handlers to accept namespaceId
export async function handleGet(namespaceId: string, key: string) {
  log('Executing kv_get for key:', key, 'in namespace:', namespaceId)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('KV get response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('KV get error:', error)
    throw new Error(`Failed to get value: ${error}`)
  }

  const value = await response.text()
  log('KV get success:', value)
  return value
}

export async function handlePut(namespaceId: string, key: string, value: string, expirationTtl?: number) {
  log('Executing kv_put for key:', key, 'in namespace:', namespaceId)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'text/plain',
    },
    body: value,
    ...(expirationTtl ? { query: { expiration_ttl: expirationTtl } } : {}),
  })

  log('KV put response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('KV put error:', error)
    throw new Error(`Failed to put value: ${error}`)
  }

  return 'Success'
}

export async function handleDelete(namespaceId: string, key: string) {
  log('Executing kv_delete for key:', key, 'in namespace:', namespaceId)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('KV delete response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('KV delete error:', error)
    throw new Error(`Failed to delete key: ${error}`)
  }

  return 'Success'
}

export async function handleList(namespaceId: string, prefix?: string, limit?: number) {
  log('Executing kv_list in namespace:', namespaceId)
  const params = new URLSearchParams()
  if (prefix) params.append('prefix', prefix)
  if (limit) params.append('limit', limit.toString())

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${namespaceId}/keys?${params}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('KV list response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('KV list error:', error)
    throw new Error(`Failed to list keys: ${error}`)
  }

  const data = (await response.json()) as CloudflareListResponse
  log('KV list success:', data)
  return data.result
}

export const KV_HANDLERS: ToolHandlers = {
  get_kvs: async (request) => {
    const results = await handleGetKVs()
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      },
    }
  },

  kv_get: async (request) => {
    const { namespaceId, key } = request.params.arguments as { namespaceId: string; key: string }
    const value = await handleGet(namespaceId, key)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: value,
          },
        ],
      },
    }
  },

  kv_put: async (request) => {
    const { namespaceId, key, value, expirationTtl } = request.params.arguments as {
      namespaceId: string
      key: string
      value: string
      expirationTtl?: number
    }
    await handlePut(namespaceId, key, value, expirationTtl)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Successfully stored value for key: ${key}`,
          },
        ],
      },
    }
  },

  kv_delete: async (request) => {
    const { namespaceId, key } = request.params.arguments as { namespaceId: string; key: string }
    await handleDelete(namespaceId, key)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Successfully deleted key: ${key}`,
          },
        ],
      },
    }
  },

  kv_list: async (request) => {
    const { namespaceId, prefix, limit } = request.params.arguments as {
      namespaceId: string
      prefix?: string
      limit?: number
    }
    const results = await handleList(namespaceId, prefix, limit)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      },
    }
  },
}



---
File: /mcp-server-cloudflare-main/src/tools/r2.ts
---

// Add R2 tool definitions
import { config, log } from '../utils/helpers'
import { fetch } from 'undici'
import { ToolHandlers } from '../utils/types'
import { Tool } from '@modelcontextprotocol/sdk/types.js'

const R2_LIST_BUCKETS_TOOL: Tool = {
  name: 'r2_list_buckets',
  description: 'List all R2 buckets in your account',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}
const R2_CREATE_BUCKET_TOOL: Tool = {
  name: 'r2_create_bucket',
  description: 'Create a new R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the bucket to create',
      },
    },
    required: ['name'],
  },
}
const R2_DELETE_BUCKET_TOOL: Tool = {
  name: 'r2_delete_bucket',
  description: 'Delete an R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the bucket to delete',
      },
    },
    required: ['name'],
  },
}
const R2_LIST_OBJECTS_TOOL: Tool = {
  name: 'r2_list_objects',
  description: 'List objects in an R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucket: {
        type: 'string',
        description: 'Name of the bucket',
      },
      prefix: {
        type: 'string',
        description: 'Optional prefix to filter objects',
      },
      delimiter: {
        type: 'string',
        description: 'Optional delimiter for hierarchical listing',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of objects to return',
      },
    },
    required: ['bucket'],
  },
}
const R2_GET_OBJECT_TOOL: Tool = {
  name: 'r2_get_object',
  description: 'Get an object from an R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucket: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to get',
      },
    },
    required: ['bucket', 'key'],
  },
}
const R2_PUT_OBJECT_TOOL: Tool = {
  name: 'r2_put_object',
  description: 'Put an object into an R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucket: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to put',
      },
      content: {
        type: 'string',
        description: 'Content to store in the object',
      },
      contentType: {
        type: 'string',
        description: 'Optional MIME type of the content',
      },
    },
    required: ['bucket', 'key', 'content'],
  },
}
const R2_DELETE_OBJECT_TOOL: Tool = {
  name: 'r2_delete_object',
  description: 'Delete an object from an R2 bucket',
  inputSchema: {
    type: 'object',
    properties: {
      bucket: {
        type: 'string',
        description: 'Name of the bucket',
      },
      key: {
        type: 'string',
        description: 'Key of the object to delete',
      },
    },
    required: ['bucket', 'key'],
  },
}
export const R2_TOOLS = [
  R2_LIST_BUCKETS_TOOL,
  R2_CREATE_BUCKET_TOOL,
  R2_DELETE_BUCKET_TOOL,
  R2_LIST_OBJECTS_TOOL,
  R2_GET_OBJECT_TOOL,
  R2_PUT_OBJECT_TOOL,
  R2_DELETE_OBJECT_TOOL,
]

// Add R2 response interfaces
interface CloudflareR2BucketsResponse {
  result: Array<{
    name: string
    creation_date: string
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

interface CloudflareR2ObjectsResponse {
  objects: Array<{
    key: string
    size: number
    uploaded: string
    etag: string
    httpEtag: string
    version: string
  }>
  delimitedPrefixes: string[]
  truncated: boolean
}

// Add R2 handlers
export async function handleR2ListBuckets() {
  log('Executing r2_list_buckets')
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list R2 buckets: ${error}`)
  }

  const data = (await response.json()) as CloudflareR2BucketsResponse
  return data.result
}

export async function handleR2CreateBucket(name: string) {
  log('Executing r2_create_bucket:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create R2 bucket: ${error}`)
  }

  return 'Success'
}

export async function handleR2DeleteBucket(name: string) {
  log('Executing r2_delete_bucket:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${name}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete R2 bucket: ${error}`)
  }

  return 'Success'
}

export async function handleR2ListObjects(bucket: string, prefix?: string, delimiter?: string, limit?: number) {
  log('Executing r2_list_objects for bucket:', bucket)
  const params = new URLSearchParams()
  if (prefix) params.append('prefix', prefix)
  if (delimiter) params.append('delimiter', delimiter)
  if (limit) params.append('limit', limit.toString())

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${bucket}/objects?${params}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list R2 objects: ${error}`)
  }

  const data = (await response.json()) as CloudflareR2ObjectsResponse
  return data
}

export async function handleR2GetObject(bucket: string, key: string) {
  log('Executing r2_get_object for bucket:', bucket, 'key:', key)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${bucket}/objects/${key}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get R2 object: ${error}`)
  }

  const content = await response.text()
  return content
}

export async function handleR2PutObject(bucket: string, key: string, content: string, contentType?: string) {
  log('Executing r2_put_object for bucket:', bucket, 'key:', key)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${bucket}/objects/${key}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiToken}`,
  }
  if (contentType) {
    headers['Content-Type'] = contentType
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: content,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to put R2 object: ${error}`)
  }

  return 'Success'
}

export async function handleR2DeleteObject(bucket: string, key: string) {
  log('Executing r2_delete_object for bucket:', bucket, 'key:', key)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${bucket}/objects/${key}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete R2 object: ${error}`)
  }

  return 'Success'
}

export const R2_HANDLERS: ToolHandlers = {
  // Add R2 cases to the tool call handler
  r2_list_buckets: async (request) => {
    const results = await handleR2ListBuckets()
    return {
      toolResult: {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      },
    }
  },

  r2_create_bucket: async (request) => {
    const { name } = request.params.arguments as { name: string }
    await handleR2CreateBucket(name)
    return {
      toolResult: {
        content: [{ type: 'text', text: `Successfully created bucket: ${name}` }],
      },
    }
  },

  r2_delete_bucket: async (request) => {
    const { name } = request.params.arguments as { name: string }
    await handleR2DeleteBucket(name)
    return {
      toolResult: {
        content: [{ type: 'text', text: `Successfully deleted bucket: ${name}` }],
      },
    }
  },

  r2_list_objects: async (request) => {
    const { bucket, prefix, delimiter, limit } = request.params.arguments as {
      bucket: string
      prefix?: string
      delimiter?: string
      limit?: number
    }
    const results = await handleR2ListObjects(bucket, prefix, delimiter, limit)
    return {
      toolResult: {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      },
    }
  },

  r2_get_object: async (request) => {
    const { bucket, key } = request.params.arguments as { bucket: string; key: string }
    const content = await handleR2GetObject(bucket, key)
    return {
      toolResult: {
        content: [{ type: 'text', text: content }],
      },
    }
  },

  r2_put_object: async (request) => {
    const { bucket, key, content, contentType } = request.params.arguments as {
      bucket: string
      key: string
      content: string
      contentType?: string
    }
    await handleR2PutObject(bucket, key, content, contentType)
    return {
      toolResult: {
        content: [{ type: 'text', text: `Successfully stored object: ${key}` }],
      },
    }
  },

  r2_delete_object: async (request) => {
    const { bucket, key } = request.params.arguments as { bucket: string; key: string }
    await handleR2DeleteObject(bucket, key)
    return {
      toolResult: {
        content: [{ type: 'text', text: `Successfully deleted object: ${key}` }],
      },
    }
  },
}



---
File: /mcp-server-cloudflare-main/src/tools/workers.ts
---

import { config, log } from '../utils/helpers'
import { fetch, FormData } from 'undici'
import { ToolHandlers } from '../utils/types'
import { Tool } from '@modelcontextprotocol/sdk/types.js'

interface CloudflareListResponse {
  result: Array<{
    name: string
    expiration?: number
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

interface CloudflareWorkerListResponse {
  result: Array<{
    id: string
    name: string
    script?: string
    modified_on?: string
  }>
  success: boolean
  errors: any[]
  messages: any[]
}

interface CloudflareWorkerResponse {
  result: {
    id: string
    script: string
    modified_on: string
  }
  success: boolean
  errors: any[]
  messages: any[]
}

// New Worker Tool definitions
const WORKER_LIST_TOOL: Tool = {
  name: 'worker_list',
  description: 'List all Workers in your account',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}
const WORKER_GET_TOOL: Tool = {
  name: 'worker_get',
  description: "Get a Worker's script content",
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the Worker script',
      },
    },
    required: ['name'],
  },
}

// Update the WORKER_PUT_TOOL definition
const WORKER_PUT_TOOL: Tool = {
  name: 'worker_put',
  description: 'Create or update a Worker script with optional bindings and compatibility settings',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the Worker script',
      },
      script: {
        type: 'string',
        description: 'The Worker script content',
      },
      bindings: {
        type: 'array',
        description: 'Optional array of resource bindings (KV, R2, D1, etc)',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description:
                'Type of binding (kv_namespace, r2_bucket, d1_database, service, analytics_engine, queue, durable_object)',
              enum: [
                'kv_namespace',
                'r2_bucket',
                'd1_database',
                'service',
                'analytics_engine',
                'queue',
                'durable_object_namespace',
              ],
            },
            name: {
              type: 'string',
              description: 'Name of the binding in the Worker code',
            },
            namespace_id: {
              type: 'string',
              description: 'ID of the KV namespace (required for kv_namespace type)',
            },
            bucket_name: {
              type: 'string',
              description: 'Name of the R2 bucket (required for r2_bucket type)',
            },
            database_id: {
              type: 'string',
              description: 'ID of the D1 database (required for d1_database type)',
            },
            service: {
              type: 'string',
              description: 'Name of the service (required for service type)',
            },
            dataset: {
              type: 'string',
              description: 'Name of the analytics dataset (required for analytics_engine type)',
            },
            queue_name: {
              type: 'string',
              description: 'Name of the queue (required for queue type)',
            },
            class_name: {
              type: 'string',
              description: 'Name of the Durable Object class (required for durable_object_namespace type)',
            },
            script_name: {
              type: 'string',
              description: 'Optional script name for external Durable Object bindings',
            },
          },
          required: ['type', 'name'],
        },
      },
      migrations: {
        type: 'object',
        description:
          'Optional migrations object which describes the set of new/changed/deleted Durable Objects to apply when deploying this worker e.g. adding a new Durable Object for the first time requires an entry in the "new_sqlite_classes" or "new_classes" property.',
        items: {
          properties: {
            new_tag: {
              type: 'string',
              description: 'The current version after applying this migration (e.g., "v1", "v2")',
            },
            new_classes: {
              type: 'array',
              items: { type: 'string' },
              description: 'The new Durable Objects using legacy storage being added',
            },
            new_sqlite_classes: {
              type: 'array',
              items: { type: 'string' },
              description: 'The new Durable Objects using the new, improved SQLite storage being added',
            },
            renamed_classes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                },
                required: ['from', 'to'],
              },
              description: 'The Durable Objects being renamed',
            },
            deleted_classes: {
              type: 'array',
              items: { type: 'string' },
              description: 'The Durable Objects being removed',
            },
          },
          required: ['tag'],
        },
      },
      compatibility_date: {
        type: 'string',
        description: 'Optional compatibility date for the Worker (e.g., "2024-01-01")',
      },
      compatibility_flags: {
        type: 'array',
        description: 'Optional array of compatibility flags',
        items: {
          type: 'string',
        },
      },
      skip_workers_dev: {
        type: 'boolean',
        description: `Do not deploy the Worker on your workers.dev subdomain. Should be set to true if the user already has a domain name, or doesn't want this worker to be publicly accessible..`,
      },
      no_observability: {
        type: 'boolean',
        description:
          'Disable Worker Logs for this worker, which automatically ingests logs emitted from Cloudflare Workers and lets you filter, and analyze them in the Cloudflare dashboard.',
      },
    },
    required: ['name', 'script'],
  },
}

const WORKER_DELETE_TOOL: Tool = {
  name: 'worker_delete',
  description: 'Delete a Worker script',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the Worker script',
      },
    },
    required: ['name'],
  },
}
export const WORKER_TOOLS = [WORKER_LIST_TOOL, WORKER_GET_TOOL, WORKER_PUT_TOOL, WORKER_DELETE_TOOL]

export async function handleWorkerList() {
  log('Executing worker_list')
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/workers/scripts`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('Worker list response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('Worker list error:', error)
    throw new Error(`Failed to list workers: ${error}`)
  }

  const data = (await response.json()) as CloudflareWorkerListResponse // Add type assertion here
  log('Worker list success:', data)
  return data.result
}

export async function handleWorkerGet(name: string) {
  log('Executing worker_get for script:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/workers/scripts/${name}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('Worker get response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('Worker get error:', error)
    throw new Error(`Failed to get worker: ${error}`)
  }

  const data = await response.text()
  return data
}

export interface Observability {
  /** If observability is enabled for this Worker */
  enabled: boolean
  /** The sampling rate */
  head_sampling_rate?: number
}

interface CfDurableObjectMigrations {
  tag: string
  new_classes?: string[]
  new_sqlite_classes?: string[]
  renamed_classes?: {
    from: string
    to: string
  }[]
  deleted_classes?: string[]
}

interface DurableObjectBinding {
  type: 'durable_object_namespace'
  name: string
  class_name: string
  script_name?: string // Optional, defaults to the current worker
}

// Update WorkerBinding to include Durable Objects
type WorkerMetadataBinding =
  | {
      type: 'kv_namespace'
      name: string
      namespace_id: string
    }
  | {
      type: 'r2_bucket'
      name: string
      bucket_name: string
    }
  | {
      type: 'd1_database'
      name: string
      database_id: string
    }
  | {
      type: 'service'
      name: string
      service: string
    }
  | {
      type: 'analytics_engine'
      name: string
      dataset: string
    }
  | {
      type: 'queue'
      name: string
      queue_name: string
    }
  | DurableObjectBinding

type WorkerMetadataPut = {
  /** The name of the entry point module. Only exists when the worker is in the ES module format */
  main_module?: string
  /** The name of the entry point module. Only exists when the worker is in the service-worker format */
  // body_part?: string;
  compatibility_date?: string
  compatibility_flags?: string[]
  // usage_model?: "bundled" | "unbound";
  migrations?: CfDurableObjectMigrations
  // capnp_schema?: string;
  bindings: WorkerMetadataBinding[]
  // keep_bindings?: (
  // 	| WorkerMetadataBinding["type"]
  // 	| "secret_text"
  // 	| "secret_key"
  // )[];
  // logpush?: boolean;
  // placement?: CfPlacement;
  // tail_consumers?: CfTailConsumer[];
  // limits?: CfUserLimits;

  // assets?: {
  // 	jwt: string;
  // 	config?: AssetConfig;
  // };
  observability?: Observability | undefined
  // Allow unsafe.metadata to add arbitrary properties at runtime
  [key: string]: unknown
}

// Update the handleWorkerPut function
export async function handleWorkerPut(
  name: string,
  script: string,
  bindings?: WorkerMetadataBinding[],
  compatibility_date?: string,
  compatibility_flags?: string[],
  migrations?: CfDurableObjectMigrations,
  workers_dev?: boolean,
  observability?: boolean,
) {
  log('Executing worker_put for script:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/workers/scripts/${name}`

  const metadata = {
    main_module: 'worker.js',
    bindings: bindings || [],
    compatibility_date: compatibility_date || '2024-01-01',
    compatibility_flags: compatibility_flags || [],
    ...(migrations ? { migrations } : {}),
    observability: observability ? { enabled: true } : undefined,
  }

  // Create form data with metadata and script
  const formData = new FormData()
  formData.set('metadata', JSON.stringify(metadata))
  formData.set(
    'worker.js',
    new File([script], 'worker.js', {
      type: 'application/javascript+module',
    }),
  )

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
    body: formData,
  })

  log('Worker put response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('Worker put error:', error)
    throw new Error(`Failed to put worker: ${error}`)
  }

  if (workers_dev) {
    const response = await fetch(url + '/subdomain', {
      method: 'POST',
      body: JSON.stringify({
        enabled: true,
      }),
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
    })
    log('Subdomain post response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      log('Worker subdomain POST error:', error)
      throw new Error(`Failed to update subdomain: ${error}`)
    }
  }

  return 'Success'
}

export async function handleWorkerDelete(name: string) {
  log('Executing worker_delete for script:', name)
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/workers/scripts/${name}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })

  log('Worker delete response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    log('Worker delete error:', error)
    throw new Error(`Failed to delete worker: ${error}`)
  }

  return 'Success'
}

export const WORKERS_HANDLERS: ToolHandlers = {
  worker_list: async (request) => {
    const results = await handleWorkerList()
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      },
    }
  },

  worker_get: async (request) => {
    const { name } = request.params.arguments as { name: string }
    const script = await handleWorkerGet(name)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: script,
          },
        ],
      },
    }
  },

  worker_put: async (request) => {
    const {
      name,
      script,
      bindings,
      compatibility_date,
      compatibility_flags,
      migrations,
      skip_workers_dev,
      no_observability,
    } = request.params.arguments as {
      name: string
      script: string
      bindings?: WorkerMetadataBinding[]
      compatibility_date?: string
      compatibility_flags?: string[]
      migrations?: CfDurableObjectMigrations
      skip_workers_dev: boolean
      no_observability: boolean
    }
    await handleWorkerPut(
      name,
      script,
      bindings,
      compatibility_date,
      compatibility_flags,
      migrations,
      !skip_workers_dev,
      !no_observability,
    )
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Successfully deployed worker: ${name}`,
          },
        ],
      },
    }
  },

  worker_delete: async (request) => {
    const { name } = request.params.arguments as { name: string }
    await handleWorkerDelete(name)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Successfully deleted worker: ${name}`,
          },
        ],
      },
    }
  },
}



---
File: /mcp-server-cloudflare-main/src/utils/c3.ts
---

/*
 *
 * Methods copied from create-cloudflare, same names used where possible
 *
 * */

import chalk from 'chalk'

export const { white, gray, dim, hidden, bold, cyanBright, bgCyan } = chalk
const brandColor = chalk.hex('#ffb063')

export const shapes = {
  diamond: '◇',
  dash: '─',
  radioInactive: '○',
  radioActive: '●',

  backActive: '◀',
  backInactive: '◁',

  bar: '│',
  leftT: '├',
  rigthT: '┤',

  arrows: {
    left: '‹',
    right: '›',
  },

  corners: {
    tl: '╭',
    bl: '╰',
    tr: '╮',
    br: '╯',
  },
}

// Returns a string containing n non-trimmable spaces
// This is useful for places where clack trims lines of output
// but we need leading spaces
export const space = (n = 1) => {
  return hidden('\u200A'.repeat(n))
}

// Primitive for printing to STDERR. We must use STDERR for human-readable messages
// as MCP uses STDOUT
export const logRaw = (msg: string) => {
  process.stderr.write(`${msg}\n`)
}

// A simple stylized log for use within a prompt
export const log = (msg: string) => {
  const lines = msg.split('\n').map((ln) => `${gray(shapes.bar)} ${white(ln)}`)

  logRaw(lines.join('\n'))
}

// Strip the ansi color characters out of the line when calculating
// line length, otherwise the padding will be thrown off
// Used from https://github.com/natemoo-re/clack/blob/main/packages/prompts/src/index.ts
export const stripAnsi = (str: string) => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|')
  const regex = RegExp(pattern, 'g')

  return str.replace(linkRegex, '$2').replace(regex, '')
}

// Regular Expression that matches a hyperlink
// e.g. `\u001B]8;;http://example.com/\u001B\\This is a link\u001B]8;;\u001B\`
export const linkRegex =
  // eslint-disable-next-line no-control-regex
  /\u001B\]8;;(?<url>.+)\u001B\\(?<label>.+)\u001B\]8;;\u001B\\/g

export function createDialog(lines: string[]) {
  const screenWidth = process.stdout.columns
  const maxLineWidth = Math.max(
    ...lines.map((line) => stripAnsi(line).length),
    60, // Min inner width
  )
  const dividerWidth = Math.min(maxLineWidth, screenWidth)

  return [gray(shapes.dash).repeat(dividerWidth), ...lines, gray(shapes.dash).repeat(dividerWidth), ''].join('\n')
}

export const startSection = (heading: string, subheading?: string, printNewLine = true) => {
  logRaw(`${gray(shapes.corners.tl)} ${brandColor(heading)} ${subheading ? dim(subheading) : ''}`)
  if (printNewLine) {
    newline()
  }
}

export const newline = () => {
  log('')
}

// Log a simple status update with a style similar to the clack spinner
export const updateStatus = (msg: string, printNewLine = true) => {
  logRaw(
    format(msg, {
      firstLinePrefix: gray(shapes.leftT),
      linePrefix: gray(shapes.bar),
      newlineAfter: printNewLine,
    }),
  )
}

type FormatOptions = {
  linePrefix?: string
  firstLinePrefix?: string
  newlineBefore?: boolean
  newlineAfter?: boolean
  formatLine?: (line: string) => string
  multiline?: boolean
}
export const format = (
  msg: string,
  {
    linePrefix = gray(shapes.bar),
    firstLinePrefix = linePrefix,
    newlineBefore = false,
    newlineAfter = false,
    formatLine = (line: string) => white(line),
    multiline = true,
  }: FormatOptions = {},
) => {
  const lines = multiline ? msg.split('\n') : [msg]
  const formattedLines = lines.map((line, i) => (i === 0 ? firstLinePrefix : linePrefix) + space() + formatLine(line))

  if (newlineBefore) {
    formattedLines.unshift(linePrefix)
  }
  if (newlineAfter) {
    formattedLines.push(linePrefix)
  }

  return formattedLines.join('\n')
}

export const endSection = (heading: string, subheading?: string) => {
  logRaw(`${gray(shapes.corners.bl)} ${brandColor(heading)} ${subheading ? dim(subheading) : ''}\n`)
}

// Create a hyperlink in terminal
// It works in iTerm2 and VSCode's terminal, but not macOS built-in terminal app
export const hyperlink = (url: string, label = url) => {
  return `\u001B]8;;${url}\u001B\\${label}\u001B]8;;\u001B\\`
}



---
File: /mcp-server-cloudflare-main/src/utils/helpers.ts
---

// Debug logging
const debug = true
export function log(...args: any[]) {
  const msg = `[DEBUG ${new Date().toISOString()}] ${args.join(' ')}\n`
  process.stderr.write(msg)
}

// Config
export const config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
}

export { version as mcpCloudflareVersion } from '../../package.json'



---
File: /mcp-server-cloudflare-main/src/utils/types.ts
---

import z from 'zod'
import { Result, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'

export type ToolHandlers = Record<string, (request: z.infer<typeof CallToolRequestSchema>) => Promise<Result>>



---
File: /mcp-server-cloudflare-main/src/utils/wrangler.ts
---

/*
 *
 * Methods copied from wrangler, same names used where possible
 *
 * */
import fs, { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import xdgAppPaths from 'xdg-app-paths'
import TOML from '@iarna/toml'
import assert from 'node:assert'
import { mcpCloudflareVersion } from './helpers'
import { fetch, Headers, Response, RequestInit, HeadersInit } from 'undici'

export function isDirectory(configPath: string) {
  try {
    return fs.statSync(configPath).isDirectory()
  } catch (error) {
    // ignore error
    return false
  }
}

export function getGlobalWranglerConfigPath() {
  const configDir = xdgAppPaths('.wrangler').config() // New XDG compliant config path
  const legacyConfigDir = path.join(os.homedir(), '.wrangler') // Legacy config in user's home directory

  // Check for the .wrangler directory in root if it is not there then use the XDG compliant path.
  if (isDirectory(legacyConfigDir)) {
    return legacyConfigDir
  } else {
    return configDir
  }
}

const TOML_ERROR_NAME = 'TomlError'
const TOML_ERROR_SUFFIX = ' at row '

type TomlError = Error & {
  line: number
  col: number
}

export function parseTOML(input: string, file?: string): TOML.JsonMap | never {
  try {
    // Normalize CRLF to LF to avoid hitting https://github.com/iarna/iarna-toml/issues/33.
    const normalizedInput = input.replace(/\r\n/g, '\n')
    return TOML.parse(normalizedInput)
  } catch (err) {
    const { name, message, line, col } = err as TomlError
    if (name !== TOML_ERROR_NAME) {
      throw err
    }
    const text = message.substring(0, message.lastIndexOf(TOML_ERROR_SUFFIX))
    const lineText = input.split('\n')[line]
    const location = {
      lineText,
      line: line + 1,
      column: col - 1,
      file,
      fileText: input,
    }
    throw new Error(`Error parsing TOML: ${text} at ${JSON.stringify(location)}`)
  }
}

const JSON_ERROR_SUFFIX = ' in JSON at position '

/**
 * A wrapper around `JSON.parse` that throws a `ParseError`.
 */
export function parseJSON<T>(input: string, file?: string): T {
  try {
    return JSON.parse(input)
  } catch (err) {
    const { message } = err as Error
    const index = message.lastIndexOf(JSON_ERROR_SUFFIX)
    if (index < 0) {
      throw err
    }
    const text = message.substring(0, index)
    const position = parseInt(message.substring(index + JSON_ERROR_SUFFIX.length))
    const location = { file, fileText: input, position }
    throw new Error(`Error parsing JSON: ${text} at ${JSON.stringify(location)}`)
  }
}

/**
 * The tokens related to authentication.
 */
export interface AuthTokens {
  accessToken?: AccessToken
  refreshToken?: RefreshToken
  scopes?: Scope[]
}

interface RefreshToken {
  value: string
}

interface AccessToken {
  value: string
  expiry: string
}

type Scope = string

interface State extends AuthTokens {
  authorizationCode?: string
  codeChallenge?: string
  codeVerifier?: string
  hasAuthCodeBeenExchangedForAccessToken?: boolean
  stateQueryParam?: string
  scopes?: Scope[]
}

export let LocalState: State = {}

function getAuthConfigFilePath() {
  const configDir = getGlobalWranglerConfigPath()
  return path.join(configDir, 'config', 'default.toml')
}

export function getAuthTokens() {
  const configPath = getAuthConfigFilePath()

  if (!fs.existsSync(configPath)) throw new Error(`No config file found at ${configPath}`)

  const toml = parseTOML(readFileSync(configPath, 'utf8')) as {
    oauth_token?: string
    refresh_token?: string
    expiration_time?: string
    scopes?: string[]
  }

  // console.log('WE GOT IT')
  // console.log(toml)
  const { oauth_token, refresh_token, expiration_time, scopes } = toml

  LocalState = {
    accessToken: {
      value: oauth_token!,
      // If there is no `expiration_time` field then set it to an old date, to cause it to expire immediately.
      expiry: expiration_time ?? '2000-01-01:00:00:00+00:00',
    },
    refreshToken: { value: refresh_token ?? '' },
    scopes: scopes ?? [],
  }
}

export function isAccessTokenExpired(): boolean {
  const { accessToken } = LocalState
  return Boolean(accessToken && new Date() >= new Date(accessToken.expiry))
}

export async function refreshToken(): Promise<boolean> {
  // refresh
  try {
    await exchangeRefreshTokenForAccessToken()
    writeAuthConfigFile({
      oauth_token: LocalState.accessToken?.value,
      expiration_time: LocalState.accessToken?.expiry,
      refresh_token: LocalState.refreshToken?.value,
      scopes: LocalState.scopes,
    })
    return true
  } catch (err) {
    return false
  }
}

export interface UserAuthConfig {
  oauth_token?: string
  refresh_token?: string
  expiration_time?: string
  scopes?: string[]
  /** @deprecated - this field was only provided by the deprecated v1 `wrangler config` command. */
  api_token?: string
}

/**
 * Writes a a wrangler config file (auth credentials) to disk,
 * and updates the user auth state with the new credentials.
 */
export function writeAuthConfigFile(config: UserAuthConfig) {
  const configPath = getAuthConfigFilePath()

  mkdirSync(path.dirname(configPath), {
    recursive: true,
  })
  writeFileSync(path.join(configPath), TOML.stringify(config as TOML.JsonMap), {
    encoding: 'utf-8',
  })
}

const WRANGLER_CLIENT_ID = '54d11594-84e4-41aa-b438-e81b8fa78ee7'

async function fetchAuthToken(body: URLSearchParams) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    body: body.toString(),
    headers,
  })
}

async function exchangeRefreshTokenForAccessToken() {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: LocalState.refreshToken?.value ?? '',
    client_id: WRANGLER_CLIENT_ID,
  })

  const response = await fetchAuthToken(params)

  if (response.status >= 400) {
    let tokenExchangeResErr = undefined

    try {
      tokenExchangeResErr = await response.text()
      tokenExchangeResErr = JSON.parse(tokenExchangeResErr)
    } catch (e) {
      // If it can't parse to JSON ignore the error
    }

    if (tokenExchangeResErr !== undefined) {
      // We will throw the parsed error if it parsed correctly, otherwise we throw an unknown error.
      throw typeof tokenExchangeResErr === 'string' ? new Error(tokenExchangeResErr) : tokenExchangeResErr
    } else {
      throw new Error('Failed to parse Error from exchangeRefreshTokenForAccessToken')
    }
  } else {
    const json = (await getJSONFromResponse(response)) as TokenResponse
    if ('error' in json) {
      throw json.error
    }

    const { access_token, expires_in, refresh_token, scope } = json
    let scopes: Scope[] = []

    const accessToken: AccessToken = {
      value: access_token,
      expiry: new Date(Date.now() + expires_in * 1000).toISOString(),
    }
    LocalState.accessToken = accessToken

    if (refresh_token) {
      LocalState.refreshToken = {
        value: refresh_token,
      }
    }

    if (scope) {
      // Multiple scopes are passed and delimited by spaces,
      // despite using the singular name "scope".
      scopes = scope.split(' ') as Scope[]
      LocalState.scopes = scopes
    }
  }
}

type TokenResponse =
  | {
      access_token: string
      expires_in: number
      refresh_token: string
      scope: string
    }
  | {
      error: string
    }

async function getJSONFromResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    // Sometime we get an error response where the body is HTML
    if (text.match(/<!DOCTYPE html>/)) {
      console.error(
        'The body of the response was HTML rather than JSON. Check the debug logs to see the full body of the response.',
      )
      if (text.match(/challenge-platform/)) {
        console.error(
          `It looks like you might have hit a bot challenge page. This may be transient but if not, please contact Cloudflare to find out what can be done. When you contact Cloudflare, please provide your Ray ID: ${response.headers.get('cf-ray')}`,
        )
      }
    }
    console.debug('Full body of response\n\n', text)
    throw new Error(`Invalid JSON in response: status: ${response.status} ${response.statusText}`, { cause: e })
  }
}

export async function fetchInternal<ResponseType>(
  resource: string,
  init: RequestInit = {},
  queryParams?: URLSearchParams,
  abortSignal?: AbortSignal,
): Promise<ResponseType> {
  const method = init.method ?? 'GET'
  const response = await performApiFetch(resource, init, queryParams, abortSignal)
  const jsonText = await response.text()
  // logger.debug(
  // 	"-- START CF API RESPONSE:",
  // 	response.statusText,
  // 	response.status
  // );
  const logHeaders = cloneHeaders(response.headers)
  delete logHeaders['Authorization']
  // logger.debugWithSanitization("HEADERS:", JSON.stringify(logHeaders, null, 2));
  // logger.debugWithSanitization("RESPONSE:", jsonText);
  // logger.debug("-- END CF API RESPONSE");

  // HTTP 204 and HTTP 205 responses do not return a body. We need to special-case this
  // as otherwise parseJSON will throw an error back to the user.
  if (!jsonText && (response.status === 204 || response.status === 205)) {
    const emptyBody = `{"result": {}, "success": true, "errors": [], "messages": []}`
    return parseJSON<ResponseType>(emptyBody)
  }

  try {
    return parseJSON<ResponseType>(jsonText)
  } catch (err) {
    throw new Error(
      JSON.stringify({
        text: 'Received a malformed response from the API',
        notes: [
          {
            text: truncate(jsonText, 100),
          },
          {
            text: `${method} ${resource} -> ${response.status} ${response.statusText}`,
          },
        ],
        status: response.status,
      }),
    )
  }
}

/*
 * performApiFetch does everything required to make a CF API request,
 * but doesn't parse the response as JSON. For normal V4 API responses,
 * use `fetchInternal`
 * */
export async function performApiFetch(
  resource: string,
  init: RequestInit = {},
  queryParams?: URLSearchParams,
  abortSignal?: AbortSignal,
) {
  const method = init.method ?? 'GET'
  assert(resource.startsWith('/'), `CF API fetch - resource path must start with a "/" but got "${resource}"`)
  // await requireLoggedIn();
  const apiToken = requireApiToken()
  const headers = cloneHeaders(init.headers)
  addAuthorizationHeaderIfUnspecified(headers, apiToken)
  addUserAgent(headers)

  const queryString = queryParams ? `?${queryParams.toString()}` : ''
  // logger.debug(
  // 	`-- START CF API REQUEST: ${method} ${getCloudflareApiBaseUrl()}${resource}${queryString}`
  // );
  const logHeaders = cloneHeaders(headers)
  delete logHeaders['Authorization']
  // logger.debugWithSanitization("HEADERS:", JSON.stringify(logHeaders, null, 2));

  // logger.debugWithSanitization("INIT:", JSON.stringify({ ...init }, null, 2));
  // if (init.body instanceof FormData) {
  // 	logger.debugWithSanitization(
  // 		"BODY:",
  // 		await new Response(init.body).text(),
  // 		null,
  // 		2
  // 	);
  // }
  // logger.debug("-- END CF API REQUEST");
  return await fetch(`${getCloudflareApiBaseUrl()}${resource}${queryString}`, {
    method,
    ...init,
    headers,
    signal: abortSignal,
  })
}

export type ApiCredentials =
  | {
      apiToken: string
    }
  | {
      authKey: string
      authEmail: string
    }

export function requireApiToken(): ApiCredentials {
  const credentials = LocalState.accessToken?.value
  if (!credentials) {
    throw new Error('No API token found.')
  }
  return { apiToken: credentials }
}

function cloneHeaders(headers: HeadersInit | undefined): Record<string, string> {
  return headers instanceof Headers
    ? Object.fromEntries(headers.entries())
    : Array.isArray(headers)
      ? Object.fromEntries(headers)
      : ({ ...headers } as Record<string, string>)
}

function addAuthorizationHeaderIfUnspecified(headers: Record<string, string>, auth: ApiCredentials): void {
  if (!('Authorization' in headers)) {
    if ('apiToken' in auth) {
      headers['Authorization'] = `Bearer ${auth.apiToken}`
    } else {
      headers['X-Auth-Key'] = auth.authKey
      headers['X-Auth-Email'] = auth.authEmail
    }
  }
}

function addUserAgent(headers: Record<string, string>): void {
  headers['User-Agent'] = `mcp-cloudflare/${mcpCloudflareVersion}`
}
export const getCloudflareApiBaseUrl = () => 'https://api.cloudflare.com/client/v4'

function truncate(text: string, maxLength: number): string {
  const { length } = text
  if (length <= maxLength) {
    return text
  }
  return `${text.substring(0, maxLength)}... (length = ${length})`
}

export interface FetchError {
  code: number
  message: string
  error_chain?: FetchError[]
}

export interface FetchResult<ResponseType = unknown> {
  success: boolean
  result: ResponseType
  errors: FetchError[]
  messages?: string[]
  result_info?: unknown
}

export type AccountInfo = { name: string; id: string }



---
File: /mcp-server-cloudflare-main/src/index.ts
---

#!/usr/bin/env node
import { init } from './init'
import { config, log } from './utils/helpers'
import { main } from './main'
import { getAuthTokens, isAccessTokenExpired, LocalState, refreshToken } from './utils/wrangler'

// Handle process events
process.on('uncaughtException', (error) => {
  log('Uncaught exception:', error)
})

process.on('unhandledRejection', (error) => {
  log('Unhandled rejection:', error)
})

const [cmd, ...args] = process.argv.slice(2)
if (cmd === 'init') {
  const [accountId, ...rest] = args
  if (rest.length > 0) {
    throw new Error(`Usage: npx @cloudflare/mcp-server-cloudflare init [account_id]`)
  }

  init(accountId)
} else if (cmd === 'run') {
  const [accountId, ...rest] = args
  if (!accountId && !config.accountId) {
    throw new Error(`Missing account ID. Usage: npx @cloudflare/mcp-server-cloudflare run [account_id]`)
  }
  if (rest.length > 0) {
    throw new Error(`Too many arguments. Usage: npx @cloudflare/mcp-server-cloudflare run [account_id]`)
  }
  config.accountId = accountId

  if (!config.accountId || !config.apiToken) {
    getAuthTokens()

    if (isAccessTokenExpired()) {
      if (await refreshToken()) {
        console.log('Successfully refreshed access token')
      } else {
        console.log('Failed to refresh access token')
      }
    }
    config.apiToken = LocalState.accessToken?.value
  }

  log(
    'Config loaded:',
    JSON.stringify({
      accountId: config.accountId ? '✓' : '✗',
      apiToken: config.apiToken ? '✓' : '✗',
    }),
  )

  // Start the server
  main()
} else {
  throw new Error(`Unknown command: ${cmd}. Expected 'init' or 'run'.`)
}



---
File: /mcp-server-cloudflare-main/src/init.ts
---

// Shell out to `npx wrangler@latest whoami`
import { exec } from 'child_process'
import { promisify } from 'util'
import {
  AccountInfo,
  fetchInternal,
  FetchResult,
  getAuthTokens,
  isAccessTokenExpired,
  isDirectory,
  refreshToken,
} from './utils/wrangler'
import chalk from 'chalk'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { createDialog, endSection, logRaw, startSection, updateStatus } from './utils/c3'
import { mcpCloudflareVersion } from './utils/helpers'
import which from 'which'

const __filename = fileURLToPath(import.meta.url)

const execAsync = promisify(exec)

export async function init(accountTag: string | undefined) {
  logRaw(
    createDialog([
      `👋 Welcome to ${chalk.yellow('mcp-server-cloudflare')} v${mcpCloudflareVersion}!`,
      `💁‍♀️ This ${chalk.green("'init'")} process will ensure you're connected to the Cloudflare API`,
      `   and install the Cloudflare MCP Server into Claude Desktop (${chalk.blue.underline('https://claude.ai/download')})`,
      `ℹ️ For more information, visit ${chalk.blue.underline('https://github.com/cloudflare/mcp-server-cloudflare')}`,
      `🧡 Let's get started.`,
    ]),
  )

  startSection(`Checking for existing Wrangler auth info`, `Step 1 of 3`)
  updateStatus(chalk.gray(`If anything goes wrong, try running 'npx wrangler@latest login' manually and retrying.`))

  try {
    getAuthTokens()
  } catch (e: any) {
    updateStatus(`${chalk.underline.red('Warning:')} ${chalk.gray(e.message)}`, false)
    updateStatus(`Running '${chalk.yellow('npx wrangler login')}' and retrying...`, false)

    const { stderr, stdout } = await execAsync('npx wrangler@latest login')
    if (stderr) updateStatus(chalk.gray(stderr))

    getAuthTokens()
  }

  updateStatus(`Wrangler auth info loaded!`)

  if (isAccessTokenExpired()) {
    updateStatus(`Access token expired, refreshing...`, false)
    if (await refreshToken()) {
      updateStatus('Successfully refreshed access token')
    } else {
      throw new Error('Failed to refresh access token')
    }
  }

  endSection('Done')
  startSection(`Fetching account info`, `Step 2 of 3`)

  const { result: accounts } = await fetchInternal<FetchResult<AccountInfo[]>>('/accounts')

  let account: string
  switch (accounts.length) {
    case 0:
      throw new Error(`No accounts found. Run 'wrangler whoami' for more info.`)
    case 1:
      if (accountTag && accountTag !== accounts[0].id) {
        throw new Error(`You don't have access to account ${accountTag}. Leave blank to use ${accounts[0].id}.`)
      }
      account = accounts[0].id
      break
    default:
      if (!accountTag) {
        throw new Error(
          `${chalk.red('Multiple accounts found.')}\nUse ${chalk.yellow('npx @cloudflare/mcp-server-cloudflare init [account_id]')} to specify which account to use.\nYou have access to:\n${accounts.map((a) => `  • ${a.name} — ${a.id}`).join('\n')}`,
        )
      }
      account = accountTag
      break
  }

  updateStatus(`Using account: ${chalk.yellow(account)}`)
  endSection('Done')

  startSection(`Configuring Claude Desktop`, `Step 3 of 3`)

  const claudeConfigPath = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json',
  )
  const cloudflareConfig = {
    command: (await which('node')).trim(),
    args: [__filename, 'run', account],
  }

  updateStatus(`Looking for existing config in: ${chalk.yellow(path.dirname(claudeConfigPath))}`)
  const configDirExists = isDirectory(path.dirname(claudeConfigPath))
  if (configDirExists) {
    const existingConfig = fs.existsSync(claudeConfigPath)
      ? JSON.parse(fs.readFileSync(claudeConfigPath, 'utf8'))
      : { mcpServers: {} }
    if ('cloudflare' in (existingConfig?.mcpServers || {})) {
      updateStatus(
        `${chalk.green('Note:')} Replacing existing Cloudflare MCP config:\n${chalk.gray(JSON.stringify(existingConfig.mcpServers.cloudflare))}`,
      )
    }
    const newConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        cloudflare: cloudflareConfig,
      },
    }
    fs.writeFileSync(claudeConfigPath, JSON.stringify(newConfig, null, 2))

    updateStatus(`${chalk.yellow('mcp-server-cloudflare')} configured & added to Claude Desktop!`, false)
    updateStatus(`Wrote config to ${chalk.yellow(claudeConfigPath)}:`, false)
    updateStatus(chalk.gray(JSON.stringify(newConfig, null, 2)))
    updateStatus(chalk.blue(`Try asking Claude to "tell me which Workers I have on my account" to get started!`))
  } else {
    const fullConfig = { mcpServers: { cloudflare: cloudflareConfig } }
    updateStatus(
      `Couldn't detect Claude Desktop config at ${claudeConfigPath}.\nTo add the Cloudflare MCP server manually, add the following config to your ${chalk.yellow('claude_desktop_configs.json')} file:\n\n${JSON.stringify(fullConfig, null, 2)}`,
    )
  }

  endSection('Done')
}



---
File: /mcp-server-cloudflare-main/src/main.ts
---

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { log } from './utils/helpers'
import { R2_HANDLERS, R2_TOOLS } from './tools/r2'
import { D1_HANDLERS, D1_TOOLS } from './tools/d1'
import { KV_HANDLERS, KV_TOOLS } from './tools/kv'
import { ANALYTICS_HANDLERS, ANALYTICS_TOOLS } from './tools/analytics'
import { WORKER_TOOLS, WORKERS_HANDLERS } from './tools/workers'

// Types for Cloudflare responses

// Combine all tools

const ALL_TOOLS = [...KV_TOOLS, ...WORKER_TOOLS, ...ANALYTICS_TOOLS, ...R2_TOOLS, ...D1_TOOLS]

// Create server
const server = new Server(
  { name: 'cloudflare', version: '1.0.0' }, // Changed from cloudflare-kv to cloudflare
  { capabilities: { tools: {} } },
)

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('Received list tools request')
  return { tools: ALL_TOOLS }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name
  log('Received tool call:', toolName)

  try {
    if (toolName in ANALYTICS_HANDLERS) {
      return await ANALYTICS_HANDLERS[toolName](request)
    }
    if (toolName in D1_HANDLERS) {
      return await D1_HANDLERS[toolName](request)
    }
    if (toolName in KV_HANDLERS) {
      return await KV_HANDLERS[toolName](request)
    }
    if (toolName in WORKERS_HANDLERS) {
      return await WORKERS_HANDLERS[toolName](request)
    }
    if (toolName in R2_HANDLERS) {
      return await R2_HANDLERS[toolName](request)
    }

    throw new Error(`Unknown tool: ${toolName}`)
  } catch (error) {
    log('Error handling tool call:', error)
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      },
    }
  }
})

// Start server
export async function main() {
  log('Starting server...')
  try {
    const transport = new StdioServerTransport()
    log('Created transport')
    await server.connect(transport)
    log('Server connected and running')
  } catch (error) {
    log('Fatal error:', error)
    process.exit(1)
  }
}



---
File: /mcp-server-cloudflare-main/package.json
---

{
  "name": "@cloudflare/mcp-server-cloudflare",
  "version": "0.1.7",
  "description": "MCP server for interacting with Cloudflare API",
  "license": "MIT",
  "author": "Cloudflare, Inc. (https://cloudflare.com)",
  "homepage": "https://github.com/cloudflare/mcp-server-cloudflare",
  "bugs": "https://github.com/cloudflare/mcp-server-cloudflare/issues",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "access": "public",
  "bin": {
    "mcp-server-cloudflare": "dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --dts --format esm --external xdg-app-paths --external which",
    "postbuild": "shx chmod +x dist/*.js",
    "check": "tsc --noEmit",
    "build:watch": "pnpm build --watch"
  },
  "dependencies": {
    "@iarna/toml": "^2.2.5",
    "@modelcontextprotocol/sdk": "^0.6.0",
    "chalk": "^5.3.0",
    "dotenv": "^16.4.5",
    "undici": "^5.28.4",
    "which": "^5.0.0",
    "xdg-app-paths": "^8.3.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241112.0",
    "@types/node": "^22.10.0",
    "@types/which": "^3.0.4",
    "prettier": "^3.4.1",
    "shx": "^0.3.4",
    "tsup": "^8.3.5",
    "typescript": "^5.6.2"
  },
  "engines": {
    "node": ">=16.17.0"
  }
}



---
File: /mcp-server-cloudflare-main/pnpm-lock.yaml
---

lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@iarna/toml':
        specifier: ^2.2.5
        version: 2.2.5
      '@modelcontextprotocol/sdk':
        specifier: ^0.6.0
        version: 0.6.1
      chalk:
        specifier: ^5.3.0
        version: 5.3.0
      dotenv:
        specifier: ^16.4.5
        version: 16.4.5
      undici:
        specifier: ^5.28.4
        version: 5.28.4
      which:
        specifier: ^5.0.0
        version: 5.0.0
      xdg-app-paths:
        specifier: ^8.3.0
        version: 8.3.0
      zod:
        specifier: ^3.23.8
        version: 3.23.8
    devDependencies:
      '@cloudflare/workers-types':
        specifier: ^4.20241112.0
        version: 4.20241112.0
      '@types/node':
        specifier: ^22.10.0
        version: 22.10.0
      '@types/which':
        specifier: ^3.0.4
        version: 3.0.4
      prettier:
        specifier: ^3.4.1
        version: 3.4.1
      shx:
        specifier: ^0.3.4
        version: 0.3.4
      tsup:
        specifier: ^8.3.5
        version: 8.3.5(typescript@5.7.2)
      typescript:
        specifier: ^5.6.2
        version: 5.7.2

packages:

  '@cloudflare/workers-types@4.20241112.0':
    resolution: {integrity: sha512-Q4p9bAWZrX14bSCKY9to19xl0KMU7nsO5sJ2cTVspHoypsjPUMeQCsjHjmsO2C4Myo8/LPeDvmqFmkyNAPPYZw==}

  '@esbuild/aix-ppc64@0.24.0':
    resolution: {integrity: sha512-WtKdFM7ls47zkKHFVzMz8opM7LkcsIp9amDUBIAWirg70RM71WRSjdILPsY5Uv1D42ZpUfaPILDlfactHgsRkw==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/android-arm64@0.24.0':
    resolution: {integrity: sha512-Vsm497xFM7tTIPYK9bNTYJyF/lsP590Qc1WxJdlB6ljCbdZKU9SY8i7+Iin4kyhV/KV5J2rOKsBQbB77Ab7L/w==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm@0.24.0':
    resolution: {integrity: sha512-arAtTPo76fJ/ICkXWetLCc9EwEHKaeya4vMrReVlEIUCAUncH7M4bhMQ+M9Vf+FFOZJdTNMXNBrWwW+OXWpSew==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-x64@0.24.0':
    resolution: {integrity: sha512-t8GrvnFkiIY7pa7mMgJd7p8p8qqYIz1NYiAoKc75Zyv73L3DZW++oYMSHPRarcotTKuSs6m3hTOa5CKHaS02TQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [android]

  '@esbuild/darwin-arm64@0.24.0':
    resolution: {integrity: sha512-CKyDpRbK1hXwv79soeTJNHb5EiG6ct3efd/FTPdzOWdbZZfGhpbcqIpiD0+vwmpu0wTIL97ZRPZu8vUt46nBSw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-x64@0.24.0':
    resolution: {integrity: sha512-rgtz6flkVkh58od4PwTRqxbKH9cOjaXCMZgWD905JOzjFKW+7EiUObfd/Kav+A6Gyud6WZk9w+xu6QLytdi2OA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/freebsd-arm64@0.24.0':
    resolution: {integrity: sha512-6Mtdq5nHggwfDNLAHkPlyLBpE5L6hwsuXZX8XNmHno9JuL2+bg2BX5tRkwjyfn6sKbxZTq68suOjgWqCicvPXA==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.24.0':
    resolution: {integrity: sha512-D3H+xh3/zphoX8ck4S2RxKR6gHlHDXXzOf6f/9dbFt/NRBDIE33+cVa49Kil4WUjxMGW0ZIYBYtaGCa2+OsQwQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/linux-arm64@0.24.0':
    resolution: {integrity: sha512-TDijPXTOeE3eaMkRYpcy3LarIg13dS9wWHRdwYRnzlwlA370rNdZqbcp0WTyyV/k2zSxfko52+C7jU5F9Tfj1g==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm@0.24.0':
    resolution: {integrity: sha512-gJKIi2IjRo5G6Glxb8d3DzYXlxdEj2NlkixPsqePSZMhLudqPhtZ4BUrpIuTjJYXxvF9njql+vRjB2oaC9XpBw==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-ia32@0.24.0':
    resolution: {integrity: sha512-K40ip1LAcA0byL05TbCQ4yJ4swvnbzHscRmUilrmP9Am7//0UjPreh4lpYzvThT2Quw66MhjG//20mrufm40mA==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-loong64@0.24.0':
    resolution: {integrity: sha512-0mswrYP/9ai+CU0BzBfPMZ8RVm3RGAN/lmOMgW4aFUSOQBjA31UP8Mr6DDhWSuMwj7jaWOT0p0WoZ6jeHhrD7g==}
    engines: {node: '>=18'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-mips64el@0.24.0':
    resolution: {integrity: sha512-hIKvXm0/3w/5+RDtCJeXqMZGkI2s4oMUGj3/jM0QzhgIASWrGO5/RlzAzm5nNh/awHE0A19h/CvHQe6FaBNrRA==}
    engines: {node: '>=18'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-ppc64@0.24.0':
    resolution: {integrity: sha512-HcZh5BNq0aC52UoocJxaKORfFODWXZxtBaaZNuN3PUX3MoDsChsZqopzi5UupRhPHSEHotoiptqikjN/B77mYQ==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-riscv64@0.24.0':
    resolution: {integrity: sha512-bEh7dMn/h3QxeR2KTy1DUszQjUrIHPZKyO6aN1X4BCnhfYhuQqedHaa5MxSQA/06j3GpiIlFGSsy1c7Gf9padw==}
    engines: {node: '>=18'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-s390x@0.24.0':
    resolution: {integrity: sha512-ZcQ6+qRkw1UcZGPyrCiHHkmBaj9SiCD8Oqd556HldP+QlpUIe2Wgn3ehQGVoPOvZvtHm8HPx+bH20c9pvbkX3g==}
    engines: {node: '>=18'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-x64@0.24.0':
    resolution: {integrity: sha512-vbutsFqQ+foy3wSSbmjBXXIJ6PL3scghJoM8zCL142cGaZKAdCZHyf+Bpu/MmX9zT9Q0zFBVKb36Ma5Fzfa8xA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [linux]

  '@esbuild/netbsd-x64@0.24.0':
    resolution: {integrity: sha512-hjQ0R/ulkO8fCYFsG0FZoH+pWgTTDreqpqY7UnQntnaKv95uP5iW3+dChxnx7C3trQQU40S+OgWhUVwCjVFLvg==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/openbsd-arm64@0.24.0':
    resolution: {integrity: sha512-MD9uzzkPQbYehwcN583yx3Tu5M8EIoTD+tUgKF982WYL9Pf5rKy9ltgD0eUgs8pvKnmizxjXZyLt0z6DC3rRXg==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openbsd]

  '@esbuild/openbsd-x64@0.24.0':
    resolution: {integrity: sha512-4ir0aY1NGUhIC1hdoCzr1+5b43mw99uNwVzhIq1OY3QcEwPDO3B7WNXBzaKY5Nsf1+N11i1eOfFcq+D/gOS15Q==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/sunos-x64@0.24.0':
    resolution: {integrity: sha512-jVzdzsbM5xrotH+W5f1s+JtUy1UWgjU0Cf4wMvffTB8m6wP5/kx0KiaLHlbJO+dMgtxKV8RQ/JvtlFcdZ1zCPA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/win32-arm64@0.24.0':
    resolution: {integrity: sha512-iKc8GAslzRpBytO2/aN3d2yb2z8XTVfNV0PjGlCxKo5SgWmNXx82I/Q3aG1tFfS+A2igVCY97TJ8tnYwpUWLCA==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-ia32@0.24.0':
    resolution: {integrity: sha512-vQW36KZolfIudCcTnaTpmLQ24Ha1RjygBo39/aLkM2kmjkWmZGEJ5Gn9l5/7tzXA42QGIoWbICfg6KLLkIw6yw==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-x64@0.24.0':
    resolution: {integrity: sha512-7IAFPrjSQIJrGsK6flwg7NFmwBoSTyF3rl7If0hNUFQU4ilTsEPL6GuMuU9BfIWVVGuRnuIidkSMC+c0Otu8IA==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [win32]

  '@fastify/busboy@2.1.1':
    resolution: {integrity: sha512-vBZP4NlzfOlerQTnba4aqZoMhE/a9HY7HRqoOPaETQcSQuWEIyZMHGfVu6w9wGtGK5fED5qRs2DteVCjOH60sA==}
    engines: {node: '>=14'}

  '@iarna/toml@2.2.5':
    resolution: {integrity: sha512-trnsAYxU3xnS1gPHPyU961coFyLkh4gAD/0zQ5mymY4yOZ+CYvsPqUbOFSw0aDM4y0tV7tiFxL/1XfXPNC6IPg==}

  '@isaacs/cliui@8.0.2':
    resolution: {integrity: sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==}
    engines: {node: '>=12'}

  '@jridgewell/gen-mapping@0.3.5':
    resolution: {integrity: sha512-IzL8ZoEDIBRWEzlCcRhOaCupYyN5gdIK+Q6fbFdPDg6HqX6jpkItn7DFIpW9LQzXG6Df9sA7+OKnq0qlz/GaQg==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/resolve-uri@3.1.2':
    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/set-array@1.2.1':
    resolution: {integrity: sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/sourcemap-codec@1.5.0':
    resolution: {integrity: sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==}

  '@jridgewell/trace-mapping@0.3.25':
    resolution: {integrity: sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==}

  '@modelcontextprotocol/sdk@0.6.1':
    resolution: {integrity: sha512-OkVXMix3EIbB5Z6yife2XTrSlOnVvCLR1Kg91I4pYFEsV9RbnoyQVScXCuVhGaZHOnTZgso8lMQN1Po2TadGKQ==}

  '@pkgjs/parseargs@0.11.0':
    resolution: {integrity: sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==}
    engines: {node: '>=14'}

  '@rollup/rollup-android-arm-eabi@4.27.4':
    resolution: {integrity: sha512-2Y3JT6f5MrQkICUyRVCw4oa0sutfAsgaSsb0Lmmy1Wi2y7X5vT9Euqw4gOsCyy0YfKURBg35nhUKZS4mDcfULw==}
    cpu: [arm]
    os: [android]

  '@rollup/rollup-android-arm64@4.27.4':
    resolution: {integrity: sha512-wzKRQXISyi9UdCVRqEd0H4cMpzvHYt1f/C3CoIjES6cG++RHKhrBj2+29nPF0IB5kpy9MS71vs07fvrNGAl/iA==}
    cpu: [arm64]
    os: [android]

  '@rollup/rollup-darwin-arm64@4.27.4':
    resolution: {integrity: sha512-PlNiRQapift4LNS8DPUHuDX/IdXiLjf8mc5vdEmUR0fF/pyy2qWwzdLjB+iZquGr8LuN4LnUoSEvKRwjSVYz3Q==}
    cpu: [arm64]
    os: [darwin]

  '@rollup/rollup-darwin-x64@4.27.4':
    resolution: {integrity: sha512-o9bH2dbdgBDJaXWJCDTNDYa171ACUdzpxSZt+u/AAeQ20Nk5x+IhA+zsGmrQtpkLiumRJEYef68gcpn2ooXhSQ==}
    cpu: [x64]
    os: [darwin]

  '@rollup/rollup-freebsd-arm64@4.27.4':
    resolution: {integrity: sha512-NBI2/i2hT9Q+HySSHTBh52da7isru4aAAo6qC3I7QFVsuhxi2gM8t/EI9EVcILiHLj1vfi+VGGPaLOUENn7pmw==}
    cpu: [arm64]
    os: [freebsd]

  '@rollup/rollup-freebsd-x64@4.27.4':
    resolution: {integrity: sha512-wYcC5ycW2zvqtDYrE7deary2P2UFmSh85PUpAx+dwTCO9uw3sgzD6Gv9n5X4vLaQKsrfTSZZ7Z7uynQozPVvWA==}
    cpu: [x64]
    os: [freebsd]

  '@rollup/rollup-linux-arm-gnueabihf@4.27.4':
    resolution: {integrity: sha512-9OwUnK/xKw6DyRlgx8UizeqRFOfi9mf5TYCw1uolDaJSbUmBxP85DE6T4ouCMoN6pXw8ZoTeZCSEfSaYo+/s1w==}
    cpu: [arm]
    os: [linux]

  '@rollup/rollup-linux-arm-musleabihf@4.27.4':
    resolution: {integrity: sha512-Vgdo4fpuphS9V24WOV+KwkCVJ72u7idTgQaBoLRD0UxBAWTF9GWurJO9YD9yh00BzbkhpeXtm6na+MvJU7Z73A==}
    cpu: [arm]
    os: [linux]

  '@rollup/rollup-linux-arm64-gnu@4.27.4':
    resolution: {integrity: sha512-pleyNgyd1kkBkw2kOqlBx+0atfIIkkExOTiifoODo6qKDSpnc6WzUY5RhHdmTdIJXBdSnh6JknnYTtmQyobrVg==}
    cpu: [arm64]
    os: [linux]

  '@rollup/rollup-linux-arm64-musl@4.27.4':
    resolution: {integrity: sha512-caluiUXvUuVyCHr5DxL8ohaaFFzPGmgmMvwmqAITMpV/Q+tPoaHZ/PWa3t8B2WyoRcIIuu1hkaW5KkeTDNSnMA==}
    cpu: [arm64]
    os: [linux]

  '@rollup/rollup-linux-powerpc64le-gnu@4.27.4':
    resolution: {integrity: sha512-FScrpHrO60hARyHh7s1zHE97u0KlT/RECzCKAdmI+LEoC1eDh/RDji9JgFqyO+wPDb86Oa/sXkily1+oi4FzJQ==}
    cpu: [ppc64]
    os: [linux]

  '@rollup/rollup-linux-riscv64-gnu@4.27.4':
    resolution: {integrity: sha512-qyyprhyGb7+RBfMPeww9FlHwKkCXdKHeGgSqmIXw9VSUtvyFZ6WZRtnxgbuz76FK7LyoN8t/eINRbPUcvXB5fw==}
    cpu: [riscv64]
    os: [linux]

  '@rollup/rollup-linux-s390x-gnu@4.27.4':
    resolution: {integrity: sha512-PFz+y2kb6tbh7m3A7nA9++eInGcDVZUACulf/KzDtovvdTizHpZaJty7Gp0lFwSQcrnebHOqxF1MaKZd7psVRg==}
    cpu: [s390x]
    os: [linux]

  '@rollup/rollup-linux-x64-gnu@4.27.4':
    resolution: {integrity: sha512-Ni8mMtfo+o/G7DVtweXXV/Ol2TFf63KYjTtoZ5f078AUgJTmaIJnj4JFU7TK/9SVWTaSJGxPi5zMDgK4w+Ez7Q==}
    cpu: [x64]
    os: [linux]

  '@rollup/rollup-linux-x64-musl@4.27.4':
    resolution: {integrity: sha512-5AeeAF1PB9TUzD+3cROzFTnAJAcVUGLuR8ng0E0WXGkYhp6RD6L+6szYVX+64Rs0r72019KHZS1ka1q+zU/wUw==}
    cpu: [x64]
    os: [linux]

  '@rollup/rollup-win32-arm64-msvc@4.27.4':
    resolution: {integrity: sha512-yOpVsA4K5qVwu2CaS3hHxluWIK5HQTjNV4tWjQXluMiiiu4pJj4BN98CvxohNCpcjMeTXk/ZMJBRbgRg8HBB6A==}
    cpu: [arm64]
    os: [win32]

  '@rollup/rollup-win32-ia32-msvc@4.27.4':
    resolution: {integrity: sha512-KtwEJOaHAVJlxV92rNYiG9JQwQAdhBlrjNRp7P9L8Cb4Rer3in+0A+IPhJC9y68WAi9H0sX4AiG2NTsVlmqJeQ==}
    cpu: [ia32]
    os: [win32]

  '@rollup/rollup-win32-x64-msvc@4.27.4':
    resolution: {integrity: sha512-3j4jx1TppORdTAoBJRd+/wJRGCPC0ETWkXOecJ6PPZLj6SptXkrXcNqdj0oclbKML6FkQltdz7bBA3rUSirZug==}
    cpu: [x64]
    os: [win32]

  '@types/estree@1.0.6':
    resolution: {integrity: sha512-AYnb1nQyY49te+VRAVgmzfcgjYS91mY5P0TKUDCLEM+gNnA+3T6rWITXRLYCpahpqSQbN5cE+gHpnPyXjHWxcw==}

  '@types/node@22.10.0':
    resolution: {integrity: sha512-XC70cRZVElFHfIUB40FgZOBbgJYFKKMa5nb9lxcwYstFG/Mi+/Y0bGS+rs6Dmhmkpq4pnNiLiuZAbc02YCOnmA==}

  '@types/which@3.0.4':
    resolution: {integrity: sha512-liyfuo/106JdlgSchJzXEQCVArk0CvevqPote8F8HgWgJ3dRCcTHgJIsLDuee0kxk/mhbInzIZk3QWSZJ8R+2w==}

  ansi-regex@5.0.1:
    resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}
    engines: {node: '>=8'}

  ansi-regex@6.1.0:
    resolution: {integrity: sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==}
    engines: {node: '>=12'}

  ansi-styles@4.3.0:
    resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}
    engines: {node: '>=8'}

  ansi-styles@6.2.1:
    resolution: {integrity: sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==}
    engines: {node: '>=12'}

  any-promise@1.3.0:
    resolution: {integrity: sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==}

  balanced-match@1.0.2:
    resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}

  brace-expansion@1.1.11:
    resolution: {integrity: sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==}

  brace-expansion@2.0.1:
    resolution: {integrity: sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==}

  bundle-require@5.0.0:
    resolution: {integrity: sha512-GuziW3fSSmopcx4KRymQEJVbZUfqlCqcq7dvs6TYwKRZiegK/2buMxQTPs6MGlNv50wms1699qYO54R8XfRX4w==}
    engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}
    peerDependencies:
      esbuild: '>=0.18'

  bytes@3.1.2:
    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}
    engines: {node: '>= 0.8'}

  cac@6.7.14:
    resolution: {integrity: sha512-b6Ilus+c3RrdDk+JhLKUAQfzzgLEPy6wcXqS7f/xe1EETvsDP6GORG7SFuOs6cID5YkqchW/LXZbX5bc8j7ZcQ==}
    engines: {node: '>=8'}

  chalk@5.3.0:
    resolution: {integrity: sha512-dLitG79d+GV1Nb/VYcCDFivJeK1hiukt9QjRNVOsUtTy1rR1YJsmpGGTZ3qJos+uw7WmWF4wUwBd9jxjocFC2w==}
    engines: {node: ^12.17.0 || ^14.13 || >=16.0.0}

  chokidar@4.0.1:
    resolution: {integrity: sha512-n8enUVCED/KVRQlab1hr3MVpcVMvxtZjmEa956u+4YijlmQED223XMSYj2tLuKvr4jcCTzNNMpQDUer72MMmzA==}
    engines: {node: '>= 14.16.0'}

  color-convert@2.0.1:
    resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}
    engines: {node: '>=7.0.0'}

  color-name@1.1.4:
    resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}

  commander@4.1.1:
    resolution: {integrity: sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==}
    engines: {node: '>= 6'}

  concat-map@0.0.1:
    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}

  consola@3.2.3:
    resolution: {integrity: sha512-I5qxpzLv+sJhTVEoLYNcTW+bThDCPsit0vLNKShZx6rLtpilNpmmeTPaeqJb9ZE9dV3DGaeby6Vuhrw38WjeyQ==}
    engines: {node: ^14.18.0 || >=16.10.0}

  content-type@1.0.5:
    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}
    engines: {node: '>= 0.6'}

  cross-spawn@7.0.6:
    resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}
    engines: {node: '>= 8'}

  debug@4.3.7:
    resolution: {integrity: sha512-Er2nc/H7RrMXZBFCEim6TCmMk02Z8vLC2Rbi1KEBggpo0fS6l0S1nnapwmIi3yW/+GOJap1Krg4w0Hg80oCqgQ==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  depd@2.0.0:
    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}
    engines: {node: '>= 0.8'}

  dotenv@16.4.5:
    resolution: {integrity: sha512-ZmdL2rui+eB2YwhsWzjInR8LldtZHGDoQ1ugH85ppHKwpUHL7j7rN0Ti9NCnGiQbhaZ11FpR+7ao1dNsmduNUg==}
    engines: {node: '>=12'}

  eastasianwidth@0.2.0:
    resolution: {integrity: sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==}

  emoji-regex@8.0.0:
    resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}

  emoji-regex@9.2.2:
    resolution: {integrity: sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==}

  esbuild@0.24.0:
    resolution: {integrity: sha512-FuLPevChGDshgSicjisSooU0cemp/sGXR841D5LHMB7mTVOmsEHcAxaH3irL53+8YDIeVNQEySh4DaYU/iuPqQ==}
    engines: {node: '>=18'}
    hasBin: true

  fdir@6.4.2:
    resolution: {integrity: sha512-KnhMXsKSPZlAhp7+IjUkRZKPb4fUyccpDrdFXbi4QL1qkmFh9kVY09Yox+n4MaOb3lHZ1Tv829C3oaaXoMYPDQ==}
    peerDependencies:
      picomatch: ^3 || ^4
    peerDependenciesMeta:
      picomatch:
        optional: true

  foreground-child@3.3.0:
    resolution: {integrity: sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==}
    engines: {node: '>=14'}

  fs.realpath@1.0.0:
    resolution: {integrity: sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==}

  fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  glob@10.4.5:
    resolution: {integrity: sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==}
    hasBin: true

  glob@7.2.3:
    resolution: {integrity: sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==}
    deprecated: Glob versions prior to v9 are no longer supported

  hasown@2.0.2:
    resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}
    engines: {node: '>= 0.4'}

  http-errors@2.0.0:
    resolution: {integrity: sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==}
    engines: {node: '>= 0.8'}

  iconv-lite@0.6.3:
    resolution: {integrity: sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==}
    engines: {node: '>=0.10.0'}

  inflight@1.0.6:
    resolution: {integrity: sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==}
    deprecated: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.

  inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}

  interpret@1.4.0:
    resolution: {integrity: sha512-agE4QfB2Lkp9uICn7BAqoscw4SZP9kTE2hxiFI3jBPmXJfdqiahTbUuKGsMoN2GtqL9AxhYioAcVvgsb1HvRbA==}
    engines: {node: '>= 0.10'}

  is-core-module@2.15.1:
    resolution: {integrity: sha512-z0vtXSwucUJtANQWldhbtbt7BnL0vxiFjIdDLAatwhDYty2bad6s+rijD6Ri4YuYJubLzIJLUidCh09e1djEVQ==}
    engines: {node: '>= 0.4'}

  is-fullwidth-code-point@3.0.0:
    resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}
    engines: {node: '>=8'}

  isexe@2.0.0:
    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}

  isexe@3.1.1:
    resolution: {integrity: sha512-LpB/54B+/2J5hqQ7imZHfdU31OlgQqx7ZicVlkm9kzg9/w8GKLEcFfJl/t7DCEDueOyBAD6zCCwTO6Fzs0NoEQ==}
    engines: {node: '>=16'}

  jackspeak@3.4.3:
    resolution: {integrity: sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==}

  joycon@3.1.1:
    resolution: {integrity: sha512-34wB/Y7MW7bzjKRjUKTa46I2Z7eV62Rkhva+KkopW7Qvv/OSWBqvkSY7vusOPrNuZcUG3tApvdVgNB8POj3SPw==}
    engines: {node: '>=10'}

  lilconfig@3.1.2:
    resolution: {integrity: sha512-eop+wDAvpItUys0FWkHIKeC9ybYrTGbU41U5K7+bttZZeohvnY7M9dZ5kB21GNWiFT2q1OoPTvncPCgSOVO5ow==}
    engines: {node: '>=14'}

  lines-and-columns@1.2.4:
    resolution: {integrity: sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==}

  load-tsconfig@0.2.5:
    resolution: {integrity: sha512-IXO6OCs9yg8tMKzfPZ1YmheJbZCiEsnBdcB03l0OcfK9prKnJb96siuHCr5Fl37/yo9DnKU+TLpxzTUspw9shg==}
    engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}

  lodash.sortby@4.7.0:
    resolution: {integrity: sha512-HDWXG8isMntAyRF5vZ7xKuEvOhT4AhlRt/3czTSjvGUxjYCBVRQY48ViDHyfYz9VIoBkW4TMGQNapx+l3RUwdA==}

  lru-cache@10.4.3:
    resolution: {integrity: sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==}

  minimatch@3.1.2:
    resolution: {integrity: sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==}

  minimatch@9.0.5:
    resolution: {integrity: sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==}
    engines: {node: '>=16 || 14 >=14.17'}

  minimist@1.2.8:
    resolution: {integrity: sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==}

  minipass@7.1.2:
    resolution: {integrity: sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==}
    engines: {node: '>=16 || 14 >=14.17'}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  mz@2.7.0:
    resolution: {integrity: sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==}

  object-assign@4.1.1:
    resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}
    engines: {node: '>=0.10.0'}

  once@1.4.0:
    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}

  os-paths@7.4.0:
    resolution: {integrity: sha512-Ux1J4NUqC6tZayBqLN1kUlDAEvLiQlli/53sSddU4IN+h+3xxnv2HmRSMpVSvr1hvJzotfMs3ERvETGK+f4OwA==}
    engines: {node: '>= 4.0'}

  package-json-from-dist@1.0.1:
    resolution: {integrity: sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==}

  path-is-absolute@1.0.1:
    resolution: {integrity: sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==}
    engines: {node: '>=0.10.0'}

  path-key@3.1.1:
    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
    engines: {node: '>=8'}

  path-parse@1.0.7:
    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}

  path-scurry@1.11.1:
    resolution: {integrity: sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==}
    engines: {node: '>=16 || 14 >=14.18'}

  picocolors@1.1.1:
    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}

  picomatch@4.0.2:
    resolution: {integrity: sha512-M7BAV6Rlcy5u+m6oPhAPFgJTzAioX/6B0DxyvDlo9l8+T3nLKbrczg2WLUyzd45L8RqfUMyGPzekbMvX2Ldkwg==}
    engines: {node: '>=12'}

  pirates@4.0.6:
    resolution: {integrity: sha512-saLsH7WeYYPiD25LDuLRRY/i+6HaPYr6G1OUlN39otzkSTxKnubR9RTxS3/Kk50s1g2JTgFwWQDQyplC5/SHZg==}
    engines: {node: '>= 6'}

  postcss-load-config@6.0.1:
    resolution: {integrity: sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==}
    engines: {node: '>= 18'}
    peerDependencies:
      jiti: '>=1.21.0'
      postcss: '>=8.0.9'
      tsx: ^4.8.1
      yaml: ^2.4.2
    peerDependenciesMeta:
      jiti:
        optional: true
      postcss:
        optional: true
      tsx:
        optional: true
      yaml:
        optional: true

  prettier@3.4.1:
    resolution: {integrity: sha512-G+YdqtITVZmOJje6QkXQWzl3fSfMxFwm1tjTyo9exhkmWSqC4Yhd1+lug++IlR2mvRVAxEDDWYkQdeSztajqgg==}
    engines: {node: '>=14'}
    hasBin: true

  punycode@2.3.1:
    resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}
    engines: {node: '>=6'}

  raw-body@3.0.0:
    resolution: {integrity: sha512-RmkhL8CAyCRPXCE28MMH0z2PNWQBNk2Q09ZdxM9IOOXwxwZbN+qbWaatPkdkWIKL2ZVDImrN/pK5HTRz2PcS4g==}
    engines: {node: '>= 0.8'}

  readdirp@4.0.2:
    resolution: {integrity: sha512-yDMz9g+VaZkqBYS/ozoBJwaBhTbZo3UNYQHNRw1D3UFQB8oHB4uS/tAODO+ZLjGWmUbKnIlOWO+aaIiAxrUWHA==}
    engines: {node: '>= 14.16.0'}

  rechoir@0.6.2:
    resolution: {integrity: sha512-HFM8rkZ+i3zrV+4LQjwQ0W+ez98pApMGM3HUrN04j3CqzPOzl9nmP15Y8YXNm8QHGv/eacOVEjqhmWpkRV0NAw==}
    engines: {node: '>= 0.10'}

  resolve-from@5.0.0:
    resolution: {integrity: sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==}
    engines: {node: '>=8'}

  resolve@1.22.8:
    resolution: {integrity: sha512-oKWePCxqpd6FlLvGV1VU0x7bkPmmCNolxzjMf4NczoDnQcIWrAF+cPtZn5i6n+RfD2d9i0tzpKnG6Yk168yIyw==}
    hasBin: true

  rollup@4.27.4:
    resolution: {integrity: sha512-RLKxqHEMjh/RGLsDxAEsaLO3mWgyoU6x9w6n1ikAzet4B3gI2/3yP6PWY2p9QzRTh6MfEIXB3MwsOY0Iv3vNrw==}
    engines: {node: '>=18.0.0', npm: '>=8.0.0'}
    hasBin: true

  safer-buffer@2.1.2:
    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}

  setprototypeof@1.2.0:
    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}

  shebang-command@2.0.0:
    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
    engines: {node: '>=8'}

  shebang-regex@3.0.0:
    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
    engines: {node: '>=8'}

  shelljs@0.8.5:
    resolution: {integrity: sha512-TiwcRcrkhHvbrZbnRcFYMLl30Dfov3HKqzp5tO5b4pt6G/SezKcYhmDg15zXVBswHmctSAQKznqNW2LO5tTDow==}
    engines: {node: '>=4'}
    hasBin: true

  shx@0.3.4:
    resolution: {integrity: sha512-N6A9MLVqjxZYcVn8hLmtneQWIJtp8IKzMP4eMnx+nqkvXoqinUPCbUFLp2UcWTEIUONhlk0ewxr/jaVGlc+J+g==}
    engines: {node: '>=6'}
    hasBin: true

  signal-exit@4.1.0:
    resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}
    engines: {node: '>=14'}

  source-map@0.8.0-beta.0:
    resolution: {integrity: sha512-2ymg6oRBpebeZi9UUNsgQ89bhx01TcTkmNTGnNO88imTmbSgy4nfujrgVEFKWpMTEGA11EDkTt7mqObTPdigIA==}
    engines: {node: '>= 8'}

  statuses@2.0.1:
    resolution: {integrity: sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==}
    engines: {node: '>= 0.8'}

  string-width@4.2.3:
    resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}
    engines: {node: '>=8'}

  string-width@5.1.2:
    resolution: {integrity: sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==}
    engines: {node: '>=12'}

  strip-ansi@6.0.1:
    resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}
    engines: {node: '>=8'}

  strip-ansi@7.1.0:
    resolution: {integrity: sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==}
    engines: {node: '>=12'}

  sucrase@3.35.0:
    resolution: {integrity: sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==}
    engines: {node: '>=16 || 14 >=14.17'}
    hasBin: true

  supports-preserve-symlinks-flag@1.0.0:
    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
    engines: {node: '>= 0.4'}

  thenify-all@1.6.0:
    resolution: {integrity: sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==}
    engines: {node: '>=0.8'}

  thenify@3.3.1:
    resolution: {integrity: sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==}

  tinyexec@0.3.1:
    resolution: {integrity: sha512-WiCJLEECkO18gwqIp6+hJg0//p23HXp4S+gGtAKu3mI2F2/sXC4FvHvXvB0zJVVaTPhx1/tOwdbRsa1sOBIKqQ==}

  tinyglobby@0.2.10:
    resolution: {integrity: sha512-Zc+8eJlFMvgatPZTl6A9L/yht8QqdmUNtURHaKZLmKBE12hNPSrqNkUp2cs3M/UKmNVVAMFQYSjYIVHDjW5zew==}
    engines: {node: '>=12.0.0'}

  toidentifier@1.0.1:
    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}
    engines: {node: '>=0.6'}

  tr46@1.0.1:
    resolution: {integrity: sha512-dTpowEjclQ7Kgx5SdBkqRzVhERQXov8/l9Ft9dVM9fmg0W0KQSVaXX9T4i6twCPNtYiZM53lpSSUAwJbFPOHxA==}

  tree-kill@1.2.2:
    resolution: {integrity: sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==}
    hasBin: true

  ts-interface-checker@0.1.13:
    resolution: {integrity: sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==}

  tsup@8.3.5:
    resolution: {integrity: sha512-Tunf6r6m6tnZsG9GYWndg0z8dEV7fD733VBFzFJ5Vcm1FtlXB8xBD/rtrBi2a3YKEV7hHtxiZtW5EAVADoe1pA==}
    engines: {node: '>=18'}
    hasBin: true
    peerDependencies:
      '@microsoft/api-extractor': ^7.36.0
      '@swc/core': ^1
      postcss: ^8.4.12
      typescript: '>=4.5.0'
    peerDependenciesMeta:
      '@microsoft/api-extractor':
        optional: true
      '@swc/core':
        optional: true
      postcss:
        optional: true
      typescript:
        optional: true

  typescript@5.7.2:
    resolution: {integrity: sha512-i5t66RHxDvVN40HfDd1PsEThGNnlMCMT3jMUuoh9/0TaqWevNontacunWyN02LA9/fIbEWlcHZcgTKb9QoaLfg==}
    engines: {node: '>=14.17'}
    hasBin: true

  undici-types@6.20.0:
    resolution: {integrity: sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==}

  undici@5.28.4:
    resolution: {integrity: sha512-72RFADWFqKmUb2hmmvNODKL3p9hcB6Gt2DOQMis1SEBaV6a4MH8soBvzg+95CYhCKPFedut2JY9bMfrDl9D23g==}
    engines: {node: '>=14.0'}

  unpipe@1.0.0:
    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}
    engines: {node: '>= 0.8'}

  webidl-conversions@4.0.2:
    resolution: {integrity: sha512-YQ+BmxuTgd6UXZW3+ICGfyqRyHXVlD5GtQr5+qjiNW7bF0cqrzX500HVXPBOvgXb5YnzDd+h0zqyv61KUD7+Sg==}

  whatwg-url@7.1.0:
    resolution: {integrity: sha512-WUu7Rg1DroM7oQvGWfOiAK21n74Gg+T4elXEQYkOhtyLeWiJFoOGLXPKI/9gzIie9CtwVLm8wtw6YJdKyxSjeg==}

  which@2.0.2:
    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
    engines: {node: '>= 8'}
    hasBin: true

  which@5.0.0:
    resolution: {integrity: sha512-JEdGzHwwkrbWoGOlIHqQ5gtprKGOenpDHpxE9zVR1bWbOtYRyPPHMe9FaP6x61CmNaTThSkb0DAJte5jD+DmzQ==}
    engines: {node: ^18.17.0 || >=20.5.0}
    hasBin: true

  wrap-ansi@7.0.0:
    resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}
    engines: {node: '>=10'}

  wrap-ansi@8.1.0:
    resolution: {integrity: sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==}
    engines: {node: '>=12'}

  wrappy@1.0.2:
    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}

  xdg-app-paths@8.3.0:
    resolution: {integrity: sha512-mgxlWVZw0TNWHoGmXq+NC3uhCIc55dDpAlDkMQUaIAcQzysb0kxctwv//fvuW61/nAAeUBJMQ8mnZjMmuYwOcQ==}
    engines: {node: '>= 4.0'}

  xdg-portable@10.6.0:
    resolution: {integrity: sha512-xrcqhWDvtZ7WLmt8G4f3hHy37iK7D2idtosRgkeiSPZEPmBShp0VfmRBLWAPC6zLF48APJ21yfea+RfQMF4/Aw==}
    engines: {node: '>= 4.0'}

  zod@3.23.8:
    resolution: {integrity: sha512-XBx9AXhXktjUqnepgTiE5flcKIYWi/rme0Eaj+5Y0lftuGBq+jyRu/md4WnuxqgP1ubdpNCsYEYPxrzVHD8d6g==}

snapshots:

  '@cloudflare/workers-types@4.20241112.0': {}

  '@esbuild/aix-ppc64@0.24.0':
    optional: true

  '@esbuild/android-arm64@0.24.0':
    optional: true

  '@esbuild/android-arm@0.24.0':
    optional: true

  '@esbuild/android-x64@0.24.0':
    optional: true

  '@esbuild/darwin-arm64@0.24.0':
    optional: true

  '@esbuild/darwin-x64@0.24.0':
    optional: true

  '@esbuild/freebsd-arm64@0.24.0':
    optional: true

  '@esbuild/freebsd-x64@0.24.0':
    optional: true

  '@esbuild/linux-arm64@0.24.0':
    optional: true

  '@esbuild/linux-arm@0.24.0':
    optional: true

  '@esbuild/linux-ia32@0.24.0':
    optional: true

  '@esbuild/linux-loong64@0.24.0':
    optional: true

  '@esbuild/linux-mips64el@0.24.0':
    optional: true

  '@esbuild/linux-ppc64@0.24.0':
    optional: true

  '@esbuild/linux-riscv64@0.24.0':
    optional: true

  '@esbuild/linux-s390x@0.24.0':
    optional: true

  '@esbuild/linux-x64@0.24.0':
    optional: true

  '@esbuild/netbsd-x64@0.24.0':
    optional: true

  '@esbuild/openbsd-arm64@0.24.0':
    optional: true

  '@esbuild/openbsd-x64@0.24.0':
    optional: true

  '@esbuild/sunos-x64@0.24.0':
    optional: true

  '@esbuild/win32-arm64@0.24.0':
    optional: true

  '@esbuild/win32-ia32@0.24.0':
    optional: true

  '@esbuild/win32-x64@0.24.0':
    optional: true

  '@fastify/busboy@2.1.1': {}

  '@iarna/toml@2.2.5': {}

  '@isaacs/cliui@8.0.2':
    dependencies:
      string-width: 5.1.2
      string-width-cjs: string-width@4.2.3
      strip-ansi: 7.1.0
      strip-ansi-cjs: strip-ansi@6.0.1
      wrap-ansi: 8.1.0
      wrap-ansi-cjs: wrap-ansi@7.0.0

  '@jridgewell/gen-mapping@0.3.5':
    dependencies:
      '@jridgewell/set-array': 1.2.1
      '@jridgewell/sourcemap-codec': 1.5.0
      '@jridgewell/trace-mapping': 0.3.25

  '@jridgewell/resolve-uri@3.1.2': {}

  '@jridgewell/set-array@1.2.1': {}

  '@jridgewell/sourcemap-codec@1.5.0': {}

  '@jridgewell/trace-mapping@0.3.25':
    dependencies:
      '@jridgewell/resolve-uri': 3.1.2
      '@jridgewell/sourcemap-codec': 1.5.0

  '@modelcontextprotocol/sdk@0.6.1':
    dependencies:
      content-type: 1.0.5
      raw-body: 3.0.0
      zod: 3.23.8

  '@pkgjs/parseargs@0.11.0':
    optional: true

  '@rollup/rollup-android-arm-eabi@4.27.4':
    optional: true

  '@rollup/rollup-android-arm64@4.27.4':
    optional: true

  '@rollup/rollup-darwin-arm64@4.27.4':
    optional: true

  '@rollup/rollup-darwin-x64@4.27.4':
    optional: true

  '@rollup/rollup-freebsd-arm64@4.27.4':
    optional: true

  '@rollup/rollup-freebsd-x64@4.27.4':
    optional: true

  '@rollup/rollup-linux-arm-gnueabihf@4.27.4':
    optional: true

  '@rollup/rollup-linux-arm-musleabihf@4.27.4':
    optional: true

  '@rollup/rollup-linux-arm64-gnu@4.27.4':
    optional: true

  '@rollup/rollup-linux-arm64-musl@4.27.4':
    optional: true

  '@rollup/rollup-linux-powerpc64le-gnu@4.27.4':
    optional: true

  '@rollup/rollup-linux-riscv64-gnu@4.27.4':
    optional: true

  '@rollup/rollup-linux-s390x-gnu@4.27.4':
    optional: true

  '@rollup/rollup-linux-x64-gnu@4.27.4':
    optional: true

  '@rollup/rollup-linux-x64-musl@4.27.4':
    optional: true

  '@rollup/rollup-win32-arm64-msvc@4.27.4':
    optional: true

  '@rollup/rollup-win32-ia32-msvc@4.27.4':
    optional: true

  '@rollup/rollup-win32-x64-msvc@4.27.4':
    optional: true

  '@types/estree@1.0.6': {}

  '@types/node@22.10.0':
    dependencies:
      undici-types: 6.20.0

  '@types/which@3.0.4': {}

  ansi-regex@5.0.1: {}

  ansi-regex@6.1.0: {}

  ansi-styles@4.3.0:
    dependencies:
      color-convert: 2.0.1

  ansi-styles@6.2.1: {}

  any-promise@1.3.0: {}

  balanced-match@1.0.2: {}

  brace-expansion@1.1.11:
    dependencies:
      balanced-match: 1.0.2
      concat-map: 0.0.1

  brace-expansion@2.0.1:
    dependencies:
      balanced-match: 1.0.2

  bundle-require@5.0.0(esbuild@0.24.0):
    dependencies:
      esbuild: 0.24.0
      load-tsconfig: 0.2.5

  bytes@3.1.2: {}

  cac@6.7.14: {}

  chalk@5.3.0: {}

  chokidar@4.0.1:
    dependencies:
      readdirp: 4.0.2

  color-convert@2.0.1:
    dependencies:
      color-name: 1.1.4

  color-name@1.1.4: {}

  commander@4.1.1: {}

  concat-map@0.0.1: {}

  consola@3.2.3: {}

  content-type@1.0.5: {}

  cross-spawn@7.0.6:
    dependencies:
      path-key: 3.1.1
      shebang-command: 2.0.0
      which: 2.0.2

  debug@4.3.7:
    dependencies:
      ms: 2.1.3

  depd@2.0.0: {}

  dotenv@16.4.5: {}

  eastasianwidth@0.2.0: {}

  emoji-regex@8.0.0: {}

  emoji-regex@9.2.2: {}

  esbuild@0.24.0:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.24.0
      '@esbuild/android-arm': 0.24.0
      '@esbuild/android-arm64': 0.24.0
      '@esbuild/android-x64': 0.24.0
      '@esbuild/darwin-arm64': 0.24.0
      '@esbuild/darwin-x64': 0.24.0
      '@esbuild/freebsd-arm64': 0.24.0
      '@esbuild/freebsd-x64': 0.24.0
      '@esbuild/linux-arm': 0.24.0
      '@esbuild/linux-arm64': 0.24.0
      '@esbuild/linux-ia32': 0.24.0
      '@esbuild/linux-loong64': 0.24.0
      '@esbuild/linux-mips64el': 0.24.0
      '@esbuild/linux-ppc64': 0.24.0
      '@esbuild/linux-riscv64': 0.24.0
      '@esbuild/linux-s390x': 0.24.0
      '@esbuild/linux-x64': 0.24.0
      '@esbuild/netbsd-x64': 0.24.0
      '@esbuild/openbsd-arm64': 0.24.0
      '@esbuild/openbsd-x64': 0.24.0
      '@esbuild/sunos-x64': 0.24.0
      '@esbuild/win32-arm64': 0.24.0
      '@esbuild/win32-ia32': 0.24.0
      '@esbuild/win32-x64': 0.24.0

  fdir@6.4.2(picomatch@4.0.2):
    optionalDependencies:
      picomatch: 4.0.2

  foreground-child@3.3.0:
    dependencies:
      cross-spawn: 7.0.6
      signal-exit: 4.1.0

  fs.realpath@1.0.0: {}

  fsevents@2.3.3:
    optional: true

  function-bind@1.1.2: {}

  glob@10.4.5:
    dependencies:
      foreground-child: 3.3.0
      jackspeak: 3.4.3
      minimatch: 9.0.5
      minipass: 7.1.2
      package-json-from-dist: 1.0.1
      path-scurry: 1.11.1

  glob@7.2.3:
    dependencies:
      fs.realpath: 1.0.0
      inflight: 1.0.6
      inherits: 2.0.4
      minimatch: 3.1.2
      once: 1.4.0
      path-is-absolute: 1.0.1

  hasown@2.0.2:
    dependencies:
      function-bind: 1.1.2

  http-errors@2.0.0:
    dependencies:
      depd: 2.0.0
      inherits: 2.0.4
      setprototypeof: 1.2.0
      statuses: 2.0.1
      toidentifier: 1.0.1

  iconv-lite@0.6.3:
    dependencies:
      safer-buffer: 2.1.2

  inflight@1.0.6:
    dependencies:
      once: 1.4.0
      wrappy: 1.0.2

  inherits@2.0.4: {}

  interpret@1.4.0: {}

  is-core-module@2.15.1:
    dependencies:
      hasown: 2.0.2

  is-fullwidth-code-point@3.0.0: {}

  isexe@2.0.0: {}

  isexe@3.1.1: {}

  jackspeak@3.4.3:
    dependencies:
      '@isaacs/cliui': 8.0.2
    optionalDependencies:
      '@pkgjs/parseargs': 0.11.0

  joycon@3.1.1: {}

  lilconfig@3.1.2: {}

  lines-and-columns@1.2.4: {}

  load-tsconfig@0.2.5: {}

  lodash.sortby@4.7.0: {}

  lru-cache@10.4.3: {}

  minimatch@3.1.2:
    dependencies:
      brace-expansion: 1.1.11

  minimatch@9.0.5:
    dependencies:
      brace-expansion: 2.0.1

  minimist@1.2.8: {}

  minipass@7.1.2: {}

  ms@2.1.3: {}

  mz@2.7.0:
    dependencies:
      any-promise: 1.3.0
      object-assign: 4.1.1
      thenify-all: 1.6.0

  object-assign@4.1.1: {}

  once@1.4.0:
    dependencies:
      wrappy: 1.0.2

  os-paths@7.4.0:
    optionalDependencies:
      fsevents: 2.3.3

  package-json-from-dist@1.0.1: {}

  path-is-absolute@1.0.1: {}

  path-key@3.1.1: {}

  path-parse@1.0.7: {}

  path-scurry@1.11.1:
    dependencies:
      lru-cache: 10.4.3
      minipass: 7.1.2

  picocolors@1.1.1: {}

  picomatch@4.0.2: {}

  pirates@4.0.6: {}

  postcss-load-config@6.0.1:
    dependencies:
      lilconfig: 3.1.2

  prettier@3.4.1: {}

  punycode@2.3.1: {}

  raw-body@3.0.0:
    dependencies:
      bytes: 3.1.2
      http-errors: 2.0.0
      iconv-lite: 0.6.3
      unpipe: 1.0.0

  readdirp@4.0.2: {}

  rechoir@0.6.2:
    dependencies:
      resolve: 1.22.8

  resolve-from@5.0.0: {}

  resolve@1.22.8:
    dependencies:
      is-core-module: 2.15.1
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0

  rollup@4.27.4:
    dependencies:
      '@types/estree': 1.0.6
    optionalDependencies:
      '@rollup/rollup-android-arm-eabi': 4.27.4
      '@rollup/rollup-android-arm64': 4.27.4
      '@rollup/rollup-darwin-arm64': 4.27.4
      '@rollup/rollup-darwin-x64': 4.27.4
      '@rollup/rollup-freebsd-arm64': 4.27.4
      '@rollup/rollup-freebsd-x64': 4.27.4
      '@rollup/rollup-linux-arm-gnueabihf': 4.27.4
      '@rollup/rollup-linux-arm-musleabihf': 4.27.4
      '@rollup/rollup-linux-arm64-gnu': 4.27.4
      '@rollup/rollup-linux-arm64-musl': 4.27.4
      '@rollup/rollup-linux-powerpc64le-gnu': 4.27.4
      '@rollup/rollup-linux-riscv64-gnu': 4.27.4
      '@rollup/rollup-linux-s390x-gnu': 4.27.4
      '@rollup/rollup-linux-x64-gnu': 4.27.4
      '@rollup/rollup-linux-x64-musl': 4.27.4
      '@rollup/rollup-win32-arm64-msvc': 4.27.4
      '@rollup/rollup-win32-ia32-msvc': 4.27.4
      '@rollup/rollup-win32-x64-msvc': 4.27.4
      fsevents: 2.3.3

  safer-buffer@2.1.2: {}

  setprototypeof@1.2.0: {}

  shebang-command@2.0.0:
    dependencies:
      shebang-regex: 3.0.0

  shebang-regex@3.0.0: {}

  shelljs@0.8.5:
    dependencies:
      glob: 7.2.3
      interpret: 1.4.0
      rechoir: 0.6.2

  shx@0.3.4:
    dependencies:
      minimist: 1.2.8
      shelljs: 0.8.5

  signal-exit@4.1.0: {}

  source-map@0.8.0-beta.0:
    dependencies:
      whatwg-url: 7.1.0

  statuses@2.0.1: {}

  string-width@4.2.3:
    dependencies:
      emoji-regex: 8.0.0
      is-fullwidth-code-point: 3.0.0
      strip-ansi: 6.0.1

  string-width@5.1.2:
    dependencies:
      eastasianwidth: 0.2.0
      emoji-regex: 9.2.2
      strip-ansi: 7.1.0

  strip-ansi@6.0.1:
    dependencies:
      ansi-regex: 5.0.1

  strip-ansi@7.1.0:
    dependencies:
      ansi-regex: 6.1.0

  sucrase@3.35.0:
    dependencies:
      '@jridgewell/gen-mapping': 0.3.5
      commander: 4.1.1
      glob: 10.4.5
      lines-and-columns: 1.2.4
      mz: 2.7.0
      pirates: 4.0.6
      ts-interface-checker: 0.1.13

  supports-preserve-symlinks-flag@1.0.0: {}

  thenify-all@1.6.0:
    dependencies:
      thenify: 3.3.1

  thenify@3.3.1:
    dependencies:
      any-promise: 1.3.0

  tinyexec@0.3.1: {}

  tinyglobby@0.2.10:
    dependencies:
      fdir: 6.4.2(picomatch@4.0.2)
      picomatch: 4.0.2

  toidentifier@1.0.1: {}

  tr46@1.0.1:
    dependencies:
      punycode: 2.3.1

  tree-kill@1.2.2: {}

  ts-interface-checker@0.1.13: {}

  tsup@8.3.5(typescript@5.7.2):
    dependencies:
      bundle-require: 5.0.0(esbuild@0.24.0)
      cac: 6.7.14
      chokidar: 4.0.1
      consola: 3.2.3
      debug: 4.3.7
      esbuild: 0.24.0
      joycon: 3.1.1
      picocolors: 1.1.1
      postcss-load-config: 6.0.1
      resolve-from: 5.0.0
      rollup: 4.27.4
      source-map: 0.8.0-beta.0
      sucrase: 3.35.0
      tinyexec: 0.3.1
      tinyglobby: 0.2.10
      tree-kill: 1.2.2
    optionalDependencies:
      typescript: 5.7.2
    transitivePeerDependencies:
      - jiti
      - supports-color
      - tsx
      - yaml

  typescript@5.7.2: {}

  undici-types@6.20.0: {}

  undici@5.28.4:
    dependencies:
      '@fastify/busboy': 2.1.1

  unpipe@1.0.0: {}

  webidl-conversions@4.0.2: {}

  whatwg-url@7.1.0:
    dependencies:
      lodash.sortby: 4.7.0
      tr46: 1.0.1
      webidl-conversions: 4.0.2

  which@2.0.2:
    dependencies:
      isexe: 2.0.0

  which@5.0.0:
    dependencies:
      isexe: 3.1.1

  wrap-ansi@7.0.0:
    dependencies:
      ansi-styles: 4.3.0
      string-width: 4.2.3
      strip-ansi: 6.0.1

  wrap-ansi@8.1.0:
    dependencies:
      ansi-styles: 6.2.1
      string-width: 5.1.2
      strip-ansi: 7.1.0

  wrappy@1.0.2: {}

  xdg-app-paths@8.3.0:
    dependencies:
      xdg-portable: 10.6.0
    optionalDependencies:
      fsevents: 2.3.3

  xdg-portable@10.6.0:
    dependencies:
      os-paths: 7.4.0
    optionalDependencies:
      fsevents: 2.3.3

  zod@3.23.8: {}



---
File: /mcp-server-cloudflare-main/README.md
---

# Cloudflare MCP Server

Model Context Protocol (MCP) is a [new, standardized protocol](https://modelcontextprotocol.io/introduction) for managing context between large language models (LLMs) and external systems. In this repository, we provide an installer as well as an MCP Server for [Cloudflare's API](https://api.cloudflare.com).

This lets you use Claude Desktop, or any MCP Client, to use natural language to accomplish things on your Cloudflare account, e.g.:

* `Please deploy me a new Worker with an example durable object.`
* `Can you tell me about the data in my D1 database named '...'?`
* `Can you copy all the entries from my KV namespace '...' into my R2 bucket '...'?`

## Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=vGajZpl_9yA">
    <img src="https://img.youtube.com/vi/vGajZpl_9yA/maxresdefault.jpg" alt="Demonstrating the newly-released MCP server to explore Cloudflare properties, like Workers, KV, and D1." width="600"/>
  </a>
</div>

## Setup

1. Run `npx @cloudflare/mcp-server-cloudflare init`

<div align="left">
    <img src="https://github.com/user-attachments/assets/163bed75-ec0c-478a-94b2-179969a90923" alt="Example console output" width="300"/>
</div>

2. Restart Claude Desktop, you should see a small 🔨 icon that shows the following tools available for use:

<div align="left">
    <img src="https://github.com/user-attachments/assets/a24275b1-1c6f-4754-96ef-dd7b9f0f5903" alt="Example tool icon" height="160"/>
    <img src="https://github.com/user-attachments/assets/4fb8badb-6800-4a3f-a530-a344b3584bec" alt="Example tool list" height="160"/>
</div>

## Features

### KV Store Management
- `get_kvs`: List all KV namespaces in your account
- `kv_get`: Get a value from a KV namespace
- `kv_put`: Store a value in a KV namespace
- `kv_list`: List keys in a KV namespace
- `kv_delete`: Delete a key from a KV namespace

### R2 Storage Management
- `r2_list_buckets`: List all R2 buckets in your account
- `r2_create_bucket`: Create a new R2 bucket
- `r2_delete_bucket`: Delete an R2 bucket
- `r2_list_objects`: List objects in an R2 bucket
- `r2_get_object`: Get an object from an R2 bucket
- `r2_put_object`: Put an object into an R2 bucket
- `r2_delete_object`: Delete an object from an R2 bucket

### D1 Database Management
- `d1_list_databases`: List all D1 databases in your account
- `d1_create_database`: Create a new D1 database
- `d1_delete_database`: Delete a D1 database
- `d1_query`: Execute a SQL query against a D1 database

### Workers Management
- `worker_list`: List all Workers in your account
- `worker_get`: Get a Worker's script content
- `worker_put`: Create or update a Worker script
- `worker_delete`: Delete a Worker script

### Analytics
- `analytics_get`: Retrieve analytics data for your domain
  - Includes metrics like requests, bandwidth, threats, and page views
  - Supports date range filtering

## Developing

In the current project folder, run:

```
pnpm install
pnpm build:watch
```

Then, in a second terminal:

```
node dist/index.js init
```

This will link Claude Desktop against your locally-installed version for you to test.

## Usage outside of Claude

To run the server locally, run `node dist/index run <account-id>`.

If you're using an alternative MCP Client, or testing things locally, emit the `tools/list` command to get an up-to-date list of all available tools. Then you can call these directly using the `tools/call` command.

### Workers

```javascript
// List workers
worker_list()

// Get worker code
worker_get({ name: "my-worker" })

// Update worker
worker_put({
  name: "my-worker",
  script: "export default { async fetch(request, env, ctx) { ... }}",
  bindings: [
    {
      type: "kv_namespace",
      name: "MY_KV",
      namespace_id: "abcd1234"
    },
    {
      type: "r2_bucket",
      name: "MY_BUCKET",
      bucket_name: "my-files"
    }
  ],
  compatibility_date: "2024-01-01",
  compatibility_flags: ["nodejs_compat"]
})

// Delete worker
worker_delete({ name: "my-worker" })
```

### KV Store

```javascript
// List KV namespaces
get_kvs()

// Get value
kv_get({
    namespaceId: "your_namespace_id",
    key: "myKey"
})

// Store value
kv_put({
    namespaceId: "your_namespace_id",
    key: "myKey",
    value: "myValue",
    expirationTtl: 3600 // optional, in seconds
})

// List keys
kv_list({
    namespaceId: "your_namespace_id",
    prefix: "app_", // optional
    limit: 10 // optional
})

// Delete key
kv_delete({
    namespaceId: "your_namespace_id",
    key: "myKey"
})
```

### R2 Storage

```javascript
// List buckets
r2_list_buckets()

// Create bucket
r2_create_bucket({ name: "my-bucket" })

// Delete bucket
r2_delete_bucket({ name: "my-bucket" })

// List objects in bucket
r2_list_objects({
    bucket: "my-bucket",
    prefix: "folder/", // optional
    delimiter: "/", // optional
    limit: 1000 // optional
})

// Get object
r2_get_object({
    bucket: "my-bucket",
    key: "folder/file.txt"
})

// Put object
r2_put_object({
    bucket: "my-bucket",
    key: "folder/file.txt",
    content: "Hello, World!",
    contentType: "text/plain" // optional
})

// Delete object
r2_delete_object({
    bucket: "my-bucket",
    key: "folder/file.txt"
})
```

### D1 Database

```javascript
// List databases
d1_list_databases()

// Create database
d1_create_database({ name: "my-database" })

// Delete database
d1_delete_database({ databaseId: "your_database_id" })

// Execute a single query
d1_query({
    databaseId: "your_database_id",
    query: "SELECT * FROM users WHERE age > ?",
    params: ["25"] // optional
})

// Create a table
d1_query({
    databaseId: "your_database_id",
    query: `
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
})
```

### Analytics

```javascript
// Get today's analytics
analytics_get({
    zoneId: "your_zone_id",
    since: "2024-11-26T00:00:00Z",
    until: "2024-11-26T23:59:59Z"
})
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



---
File: /mcp-server-cloudflare-main/tsconfig.json
---

{
  "compilerOptions": {
    "target": "esnext",
    "lib": [
      "esnext"
    ] /* Specify a set of bundled library declaration files that describe the target runtime environment. */,
    "module": "esnext" /* Specify what module code is generated. */,
    "moduleResolution": "Bundler" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "types": ["@cloudflare/workers-types/experimental"],

    "noEmit": true /* Disable emitting files from a compilation. */,
    "esModuleInterop": true,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}

