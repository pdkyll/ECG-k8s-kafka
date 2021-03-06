# A collection of kubernetes debug info

## Kubernetes RBAC

If a client certificate is presented and verified, the **common name of the subject** is used as the user name for the request.

Certificates can also indicate a user’s __group memberships__ using the certificate’s __organization fields__.

If the pod does not have a `ServiceAccount` set, it sets the `ServiceAccount` to `default`.

[Managing Service Accounts](https://kubernetes.io/docs/admin/service-accounts-admin/)

[Authenticating](https://kubernetes.io/docs/admin/authentication/)

[Using RBAC Authorization](https://kubernetes.io/docs/admin/authorization/rbac/)

## Kubernetes DNS

[Namespaces and DNS](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
[headless service](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)
[statefulset dns](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

When you create a Service, it creates a corresponding DNS entry. This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means that if a container just uses `<service-name>` it will resolve to the service which is local to a namespace. This is useful for using the same configuration across multiple namespaces such as Development, Staging and Production. If you want to reach across namespaces, you need to use the fully qualified domain name (FQDN).

for example:

with a `service` in namespace `kafka`
the pod in the same namespace (kafka) can resolve the domain with `nslookup service_name`, while
a pod in the default namespace should resove it with command `nslookup service_name.kafka`.

check `/etc/resolve.conf` fil

## Kubernetes network plugins

[Network Plugins](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/)

### Flannel

[Running Flannel](https://coreos.com/flannel/docs/latest/running.html)

[Flannel Configuration](https://coreos.com/flannel/docs/latest/configuration.html)

[deploy flannel with cni](https://coreos.com/kubernetes/docs/latest/deploy-workers.html)

[deploy falnnel manually](https://github.com/feiskyer/kubernetes-handbook/blob/master/deploy/centos/node-installation.md)
e to see differences

## How-to

### How to update kuerbnetes.pem

1. Modify `kubernetes-csr.json`
1. Generate new pem files
1. Distribute new pem files to the host: nodes will use kubernetes.pem (cotrollers, etcd nodes)
1. Move them to the corret folders (controller:/var/lib/kubernetes/, etcd nodes: /etc/etcd/)

### How to view logs

**Via docker**: `sudo docker logs 83295ac7ff2e|more`

**via kubernetes**: `kubectl --namespace=kube-system logs kube-dns-3097350089-kr0sp kubedns`

**NOTE**: error may occur `certificate is valid for system:node`

view discussions: [Unable to kubectl exec or kubectl run](https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/146)
[cannot kubectl exec into pods](https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/159)

### Attach to a docker container

`sudo docker exec -t -i 5d18e5f5a5a3 /bin/sh`

## Problems

### Unable to kubectl exec or kubectl run

[Unable to kubectl exec or kubectl run](https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/146)

### Networking issue

**container cannot communicate with apiserver (10.32.0.1)**:

* docker wasn't installed corretly or not configured corretcly
* don't install docker through apt or yum, or docker should be configured with `--iptables=false` and `--ip-masq=false`

refer: [kuberntes docker](https://kubernetes.io/docs/getting-started-guides/scratch/#docker)

### Problems with flannel and etcd v2 & v3

[Flannel + etcdv3?](https://github.com/coreos/flannel/issues/554)

[Error: grpc: timed out when dialing](https://github.com/coreos/etcd/issues/7336)
> This allows me to connect via ssh on a cluster node and then access the cluster from `127.0.0.1` with `etcdctl`.

### diffrences between etcd v2 and v3

use etcdctl with `API 2` cannot get records in etcd v3
must use etcdctl `API 3` to fetch records in etcd v3

==> API version 2

```bash
export ETCDCTL_CA_FILE='/home/zsy/ca.pem'
export ETCDCTL_CERT_FILE='/home/zsy/kubernetes.pem'
export ETCDCTL_KEY_FILE='/home/zsy/kubernetes-key.pem'
sudo etcdctl cluster-health
```

[etcdctl API2](https://github.com/coreos/etcd/blob/master/etcdctl/READMEv2.md)

==> API version 3

```bash
export ETCDCTL_API=3
export ETCDCTL_CACERT='/home/zsy/ca.pem'
export ETCDCTL_CERT='/home/zsy/kubernetes.pem'
export ETCDCTL_KEY='/home/zsy/kubernetes-key.pem'
export ETCDCTL_ENDPOINTS='10.0.2.11:2379'
etcdctl endpoint health --endpoints=10.0.2.11:2379 -w json
etcdctl get "" --prefix=true --keys-only | less
```

[etcdctl API3](https://github.com/coreos/etcd/tree/master/etcdctl)

## References

[kubernetes-handbook](https://github.com/feiskyer/kubernetes-handbook/blob/master/deploy/centos/create-tls-and-secret-key.md)

[Kubernetes from scratch](https://nixaid.com/kubernetes-from-scratch/)

[kubernetes-the-hard-way](https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/4d442675ba44c418be02709f61f192b09c4babc9/docs/01-infrastructure-gcp.md)

[CoreOS + Kubernetes Step By Step](https://coreos.com/kubernetes/docs/latest/getting-started.html)
