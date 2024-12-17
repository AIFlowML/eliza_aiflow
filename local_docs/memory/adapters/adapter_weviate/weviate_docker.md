Docker
Weaviate supports deployment with Docker.

You can run Weaviate with default settings from a command line, or customize your configuration by creating your own docker-compose.yml file.

Run Weaviate with default settings
Added in v1.24.1
To run Weaviate with Docker using default settings, run this command from from your shell:

docker run -p 8080:8080 -p 50051:50051 cr.weaviate.io/semitechnologies/weaviate:1.28.0

The command sets the following default environment variables in the container:

PERSISTENCE_DATA_PATH defaults to ./data
AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED defaults to true.
QUERY_DEFAULTS_LIMIT defaults to 10.
Customize your Weaviate configuration
You can customize your Weaviate configuration by creating a docker-compose.yml file. Start from our sample Docker Compose file, or use the interactive Configurator to generate a docker-compose.yml file.

Sample Docker Compose file
This starter Docker Compose file allows:

Use of any API-based model provider integrations (e.g. OpenAI, Cohere, Google, and Anthropic).
This includes the relevant embedding model, generative, and reranker integrations.
Searching pre-vectorized data (without a vectorizer).
Mounts a persistent volume called weaviate_data to /var/lib/weaviate in the container to store data.
Download and run
Save the text below as docker-compose.yml:

---
services:
  weaviate:
    command:
    - --host
    - 0.0.0.0
    - --port
    - '8080'
    - --scheme
    - http
    image: cr.weaviate.io/semitechnologies/weaviate:1.28.0
    ports:
    - 8080:8080
    - 50051:50051
    volumes:
    - weaviate_data:/var/lib/weaviate
    restart: on-failure:0
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate'
      ENABLE_API_BASED_MODULES: 'true'
      CLUSTER_HOSTNAME: 'node1'
volumes:
  weaviate_data:
...

Edit the docker-compose.yml file to suit your needs. You can add or remove environment variables, change the port mappings, or add additional model provider integrations, such as Ollama, or Hugging Face Transformers.

To start your Weaviate instance, run this command from your shell:

docker compose up -d

Configurator
The Configurator can generate a docker-compose.yml file for you. Use the Configurator to select specific Weaviate modules, including vectorizers that run locally (i.e. text2vec-transformers, or multi2vec-clip)



It is recommended to always use the latest version. You can also select an older version for compatibility sake, but not all features might be available on an older version. If you are running on arm64 hardware, please select v1.4.0 or newer.

v1.27.0
Previous
Next
Environment variables
You can use environment variables to control your Weaviate setup, authentication and authorization, module settings, and data storage settings.

List of environment variables
A comprehensive of list environment variables can be found on this page.

Example configurations
Here are some examples of how to configure docker-compose.yml.

Persistent volume
We recommended setting a persistent volume to avoid data loss as well as to improve reading and writing speeds.

Make sure to run docker compose down when shutting down. This writes all the files from memory to disk.

With named volume

services:
  weaviate:
    volumes:
        - weaviate_data:/var/lib/weaviate
    # etc

volumes:
    weaviate_data:

After running a docker compose up -d, Docker will create a named volume weaviate_data and mount it to the PERSISTENCE_DATA_PATH inside the container.

With host binding

services:
  weaviate:
    volumes:
      - /var/weaviate:/var/lib/weaviate
    # etc

After running a docker compose up -d, Docker will mount /var/weaviate on the host to the PERSISTENCE_DATA_PATH inside the container.

Weaviate without any modules
An example Docker Compose setup for Weaviate without any modules can be found below. In this case, no model inference is performed at either import or search time. You will need to provide your own vectors (e.g. from an outside ML model) at import and search time:

services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:1.28.0
    ports:
    - 8080:8080
    - 50051:50051
    restart: on-failure:0
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate'
      CLUSTER_HOSTNAME: 'node1'

Weaviate with the text2vec-transformers module
An example Docker Compose file with the transformers model sentence-transformers/multi-qa-MiniLM-L6-cos-v1 is:

services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:1.28.0
    restart: on-failure:0
    ports:
    - 8080:8080
    - 50051:50051
    environment:
      QUERY_DEFAULTS_LIMIT: 20
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: "./data"
      DEFAULT_VECTORIZER_MODULE: text2vec-transformers
      ENABLE_MODULES: text2vec-transformers
      TRANSFORMERS_INFERENCE_API: http://t2v-transformers:8080
      CLUSTER_HOSTNAME: 'node1'
  t2v-transformers:
    image: cr.weaviate.io/semitechnologies/transformers-inference:sentence-transformers-multi-qa-MiniLM-L6-cos-v1
    environment:
      ENABLE_CUDA: 0 # set to 1 to enable
      # NVIDIA_VISIBLE_DEVICES: all # enable if running with CUDA

Note that transformer models are neural networks built to run on GPUs. Running Weaviate with the text2vec-transformers module and without GPU is possible, but it will be slower. Enable CUDA with ENABLE_CUDA=1 if you have a GPU available.

For more information on how to set up the environment with the text2vec-transformers integration, see this page.

The text2vec-transformers module requires at least Weaviate version v1.2.0.

Unreleased versions
Unreleased software
DISCLAIMER: Release candidate images and other unreleased software are not supported.

Unreleased software and images may contain bugs. APIs may change. Features under development may be withdrawn or modified. Do not use unreleased software in production.

To run an unreleased version of Weaviate, edit your configuration file to use the unreleased image instead of a generally available image. The GitHub releases page lists generally available and release candidate builds.

For example, to run a Docker image for a release candidate, edit your docker-config.yaml to import the release candidate image.

image: cr.weaviate.io/semitechnologies/weaviate:1.23.0-rc.1

Multi-node configuration
To configure Weaviate to use multiple host nodes, follow these steps:

Configure one node as a "founding" member
Set the CLUSTER_JOIN variable for the other nodes in the cluster.
Set the CLUSTER_GOSSIP_BIND_PORT for each node.
Set the CLUSTER_DATA_BIND_PORT for each node.
Set the RAFT_JOIN each node.
Set the RAFT_BOOTSTRAP_EXPECT for each node with the number of voters.
Optionally, set the hostname for each node using CLUSTER_HOSTNAME.
(Read more about horizontal replication in Weaviate.)

So, the Docker Compose file includes environment variables for the "founding" member that look like this:

  weaviate-node-1:  # Founding member service name
    ...  # truncated for brevity
    environment:
      CLUSTER_HOSTNAME: 'node1'
      CLUSTER_GOSSIP_BIND_PORT: '7100'
      CLUSTER_DATA_BIND_PORT: '7101'
      RAFT_JOIN: 'node1,node2,node3'
      RAFT_BOOTSTRAP_EXPECT: 3

And the other members' configurations may look like this:

  weaviate-node-2:
    ...  # truncated for brevity
    environment:
      CLUSTER_HOSTNAME: 'node2'
      CLUSTER_GOSSIP_BIND_PORT: '7102'
      CLUSTER_DATA_BIND_PORT: '7103'
      CLUSTER_JOIN: 'weaviate-node-1:7100'  # This must be the service name of the "founding" member node.
      RAFT_JOIN: 'node1,node2,node3'
      RAFT_BOOTSTRAP_EXPECT: 3

Below is an example configuration for a 3-node setup. You may be able to test replication examples locally using this configuration.

Docker Compose file for a replication setup with 3 nodes
Port number conventions
It is a Weaviate convention to set the CLUSTER_DATA_BIND_PORT to 1 higher than CLUSTER_GOSSIP_BIND_PORT.

Shell attachment options
The output of docker compose up is quite verbose as it attaches to the logs of all containers.

You can attach the logs only to Weaviate itself, for example, by running the following command instead of docker compose up:

# Run Docker Compose
docker compose up -d && docker compose logs -f weaviate

Alternatively you can run docker compose entirely detached with docker compose up -d and then poll {bindaddress}:{port}/v1/meta until you receive a status 200 OK.

Troubleshooting
Set CLUSTER_HOSTNAME if it may change over time
In some systems, the cluster hostname may change over time. This is known to create issues with a single-node Weaviate deployment. To avoid this, set the CLUSTER_HOSTNAME environment variable in the values.yaml file to the cluster hostname.

---
services:
  weaviate:
    # ...
    environment:
      CLUSTER_HOSTNAME: 'node1'
...

Local instances
Follow these steps to connect to a locally hosted Weaviate instance.

Local connection URL
Docker instances default to http://localhost:8080. The gRPC port, 50051, is also on localhost.

If your instance runs on Kubernetes, see the host and port values in your Helm chart's values.yaml file.

No authentication enabled
To connect to a local instance without authentication, follow these examples.

Python Client v4
Python Client v3
JS/TS Client v3
JS/TS Client v2
Go
Java
cURL
import weaviate

client = weaviate.connect_to_local()

print(client.is_ready())

py docs  API docs
Change the URL or port
To change the default URL or port number, follow these examples.

Python Client v4
Python Client v3
JS/TS Client v3
JS/TS Client v2
Go
Java
cURL
import weaviate

client = weaviate.connect_to_local(
    host="127.0.0.1",  # Use a string to specify the host
    port=8080,
    grpc_port=50051,
)

print(client.is_ready())

py docs  API docs
Authentication enabled
To authenticate with a Weaviate API key, follow these examples.

Python Client v4
Python Client v3
JS/TS Client v3
JS/TS Client v2
Go
Java
cURL
import weaviate
from weaviate.classes.init import Auth

# Best practice: store your credentials in environment variables
weaviate_api_key = os.environ["WEAVIATE_API_KEY"]

client = weaviate.connect_to_local(
    auth_credentials=Auth.api_key(weaviate_api_key)
)

print(client.is_ready())

assert client.is_ready()

py docs  API docs
OIDC authentication
For details on authentication with OpenID Connect (OIDC), see OIDC configuration.

For additional client examples, see OIDC authentication.

Third party API keys
Integrations that use external APIs often need API keys. To add third party API keys, follow these examples:

Python Client v4
Python Client v3
JS/TS Client v3
JS/TS Client v2
Go
Java
cURL
import os
import weaviate

# Best practice: store your credentials in environment variables
cohere_api_key = os.environ["COHERE_API_KEY"]

client = weaviate.connect_to_local(
    headers={
        "X-Cohere-Api-Key": cohere_api_key
    }
)

print(client.is_ready())

py docs  API docs
Environment variables
danger
Do not hard-code API keys or other credentials in your client code. Use environment variables or a similar secure coding technique instead.

Environment variables keep sensitive details out of your source code. Your application imports the information to runtime.

Set an environment variable.
Import an environment variable.
gRPC timeouts
The Python client v4 and TypeScript client v3 use gRPC. The gRPC protocol is sensitive to network delay. If you encounter connection timeouts, adjust the timeout values for initialization, queries, and insertions.

Python Client v4
JS/TS Client v3
import weaviate
from weaviate.classes.init import AdditionalConfig, Timeout

client = weaviate.connect_to_local(
    port=8080,
    grpc_port=50051,
    additional_config=AdditionalConfig(
        timeout=Timeout(init=30, query=60, insert=120)  # Values in seconds
    )
)

print(client.is_ready())

py docs  API docs


