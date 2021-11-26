---
title: 阿里云-ECS云服务器跨地域部署k8s集群
date: 2021-11-26
tags:
  - k8s
categories:
  - DevOps
---
## 一 、背景介绍
> 不慌不忙，赶上了阿里云的双十一活动，用了三个不同的阿里云账号购买了三台不通地区的阿里云服务器，反正我觉得是一次成功的薅羊毛，哈哈哈，不知道你们有没有这样认知，但是购买后我才发现，ECS服务器内网是不能互通的，正赶巧我刚好要自建一个基于ECS服务器的K8S集群，然后因为网络问题折腾了好久，估计最少3天，差点就想放弃了，然后我鼓起勇气在Google搜索资料发现，可以搞虚拟一张网卡，IP用当前节点的公网IP，然后使用此IP注册进集群。总算看到了希望，哈哈哈，下面我们开始填坑摸索吧！
## 二、环境准备
### 2.1 ECS云服务资源清单
| 云服务商 | 主机名 |公网ip/私网ip|推荐配置
|--|--|--|--|
| 阿里云 | zanzancloud-k8s-master | 123.57.36.xx / 172.20.213.xx| 2C2G |
| 阿里云 | zanzancloud-k8s-node1 | 60.205.227.xx / 172.16.198.xx | 2C4G |
| 阿里云 | zanzancloud-k8s-node2 | 123.56.148.xx / 172.22.51.xx | 2C2G |
### 2.2  K8s软件列表
| 软件 | 版本 |
|--|--|
| CentOS| 7.8 |
| Kubernetes| v1.18.6 |
| Docker| 20.10.10 |
| Etcd| 3.4.3-0 |
| Flannel| 20.10.10 |
| Pause| 3.2 |
| DNS| 1.6.7 |

## 三、阿里云ECS服务器网络问题
### 3.1 问题阐述
> 一般情况下，"kubeadm"部署集群时指定"--apiserver-advertise-address=<public_ip>"参数，即可在其他机器上，通过公网ip join到本机器，然而，阿里云ecs里没配置公网ip，etcd会无法启动，导致初始化失败!

### 3.2 解决方案
> 当我部署k8s集群的时候发现，网卡上绑定的地址不是公网IP，而应用只能绑定网卡上的地址。但是私网IP之间又不通。当时内心是崩溃的！最后在官方文档得知，可以采用公网IP部署，具体参考：[传送门-公网安装k8s](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
## 四、服务节点调整（master，node1，node2）
### 4.1 关闭firewalld防火墙，并安装设置Iptables规则为空
```shell
#关闭firewalld防火墙
systemctl stop firewalld &&  systemctl  disable firewal
#安装Iptables
yum -y install iptables-services  &&  systemctl  start iptables  &&  systemctl  enable iptables&&  iptables -F  &&  service iptables save
```
### 4.2 调整内核参数
```shell
cat > k8s.conf <<EOF
#开启网桥模式
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
#开启转发
net.ipv4.ip_forward = 1
##关闭ipv6
net.ipv6.conf.all.disable_ipv6=1
EOF
cp k8s.conf /etc/sysctl.d/k8s.conf
sysctl -p /etc/sysctl.d/k8s.conf
```
### 4.3 关闭 swap
```shell
#关闭 swap
swapoff -a && sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```
### 4.4 关闭 selinux
```shell
#关闭 selinux
setenforce 0 && sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
```
### 4.5 设置hostname
```shell
#设置hostname
hostnamectl set-hostname zanzancloud-k8s-master  # zanzancloud-k8s-node1 / zanzancloud-k8s-node2
hostname

#配置host映射
cat >> /etc/hosts << EOF
123.57.36.xx  zanzancloud-k8s-master
60.205.227.xx zanzancloud-k8s-node1
123.56.148.xx zanzancloud-k8s-node2
EOF
```
### 4.6 调整服务器时区
```shell
# 设置系统时区为 中国/上海
timedatectl set-timezone Asia/Shanghai
# 将当前的UTC时间写入硬件时钟
timedatectl set-local-rtc 0
# 重启依赖于系统时间的服务
systemctl restart rsyslog
systemctl restart crond
```
### 4.7 关闭邮件服务
```shell
#关闭邮件服务
systemctl stop postfix && systemctl disable postfix
```
### 4.8 设置rsyslogd和systemd journald
**默认有两个日志服务，使用journald关闭rsyslogd**
```shell
# 持久化保存日志的目录
mkdir /var/log/journal
mkdir /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/99-prophet.conf <<EOF
[Journal]
# 持久化
Storage=persistent

# 压缩历史日志
Compress=yes

SysnIntervalSec=5m
RateLimitInterval=30s
RateLimitBurst=1000

# 最大占用空间 10G
SystemMaxUse=10G

# 单日志文件最大 200M
SystemMaxFileSize=200M

# 日志保存时间 2 周
MaxRetentionSec=2week

# 不将日志转发到 syslog
ForwardToSyslog=no

EOF
#重启journald
systemctl restart systemd-journald
```
### 4.9 ipvs前置条件准备
**ipvs转发效率比iptables更高,看上去也比iptables舒服**
```shell
modprobe br_netfilter

cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF

chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```
### 4.10 安装 Docker
```shell
wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
# yum list docker-ce --showduplicates | sort -r
yum -y install docker-ce-20.10.6-3.el7
systemctl enable docker && systemctl start docker
docker --version
# 换成阿里Docker仓库
cat > /etc/docker/daemon.json << EOF
{
  "registry-mirrors": [" https://wl5zc6br.mirror.aliyuncs.com"]
}
EOF
systemctl restart docker
docker info

# out info
# Registry Mirrors:
#  https://wl5zc6br.mirror.aliyuncs.com/
```
### 4.11 安装 Kubeadm、Kubelet、Kubectl
```shell
# 添加源
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 关闭selinux
setenforce 0

# 安装kubelet、kubeadm、kubectl
yum install -y kubelet kubeadm kubectl

# 设置为开机自启
systemctl enable kubelet 
```
### 4.12 阿里云ECS安全组端口开放
+ **10250/10260** TCP端口：给kube-schedule、kube-controll，kube-proxy、kubelet等使用

+ **6443** TCP端口：给kube-apiserver使用

+ **2379 2380 2381** TCP商品：ETCD使用

+ **8472** UDP端口：vxlan使用端口

## 五、Kubeadm安装k8s
### 5.1 建立虚拟网卡（master，node1，node2）
```shell
# 写入虚拟网卡
cat > /etc/sysconfig/network-scripts/ifcfg-eth0:1 <<EOF
BOOTPROTO=static
DEVICE=eth0:1
IPADDR=你的公网IP
PREFIX=32
TYPE=Ethernet
USERCTL=no
ONBOOT=yes
EOF
# 重启网卡
systemctl restart network
# 查看ip
ip addr
```
### 5.2 修改kubelet启动参数（master，node1，node2）
```shell
# 此文件安装kubeadm后就存在了
vim /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf

# 注意，这步很重要，如果不做，节点仍然会使用内网IP注册进集群
# 在末尾添加参数 --node-ip=公网IP

# Note: This dropin only works with kubeadm and kubelet v1.11+
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably, the user should use
# the .NodeRegistration.KubeletExtraArgs object in the configuration files instead. KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/sysconfig/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS --node-ip=公网IP
```
### 5.3 使用脚本导入镜像
#### 5.3.1 Master节点镜像导入脚本(pull_k8s_images_master.sh)-(master)
```shell
set -o errexit
set -o nounset
set -o pipefail

##这里定义版本，按照上面得到的列表自己改一下版本号
KUBE_VERSION=v1.18.6
KUBE_PAUSE_VERSION=3.2
ETCD_VERSION=3.4.3-0
DNS_VERSION=1.6.7

##这是原始仓库名，最后需要改名成这个
GCR_URL=k8s.gcr.io

##这里就是写你要使用的仓库
DOCKERHUB_URL=gotok8s

##这里是镜像列表，新版本要把coredns改成coredns/coredns
images=(
kube-proxy:${KUBE_VERSION}
kube-scheduler:${KUBE_VERSION}
kube-controller-manager:${KUBE_VERSION}
kube-apiserver:${KUBE_VERSION}
pause:${KUBE_PAUSE_VERSION}
etcd:${ETCD_VERSION}
coredns:${DNS_VERSION}
)

##这里是拉取和改名的循环语句
for imageName in ${images[@]} ; do
  docker pull $DOCKERHUB_URL/$imageName
  docker tag $DOCKERHUB_URL/$imageName $GCR_URL/$imageName
  docker rmi $DOCKERHUB_URL/$imageName
done
```
#### 5.3.2 Node节点镜像导入脚本(pull_k8s_images_node.sh)-(node1，node2)
```shell
set -o errexit
set -o nounset
set -o pipefail

##这里定义版本，按照上面得到的列表自己改一下版本号

KUBE_VERSION=v1.18.6
KUBE_PAUSE_VERSION=3.2
ETCD_VERSION=3.4.3-0
DNS_VERSION=1.6.7

##这是原始仓库名，最后需要改名成这个
GCR_URL=k8s.gcr.io

##这里就是写你要使用的仓库
DOCKERHUB_URL=gotok8s

##这里是镜像列表，新版本要把coredns改成coredns/coredns
images=(
kube-proxy:${KUBE_VERSION}
pause:${KUBE_PAUSE_VERSION}
etcd:${ETCD_VERSION}
coredns:${DNS_VERSION}
)

##这里是拉取和改名的循环语句
for imageName in ${images[@]} ; do
  docker pull $DOCKERHUB_URL/$imageName
  docker tag $DOCKERHUB_URL/$imageName $GCR_URL/$imageName
  docker rmi $DOCKERHUB_URL/$imageName
done
```
### 5.4 使用kubeadm初始化主节点（master）
```shell
# step1 添加配置文件，注意替换下面的IP
cat > kubeadm-config.yaml <<EOF
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.18.0
apiServer:
  certSANs:    #填写所有kube-apiserver节点的hostname、IP、VIP
  - zanzancloud-k8s-master    #请替换为hostname
  - 123.57.36.xx   #请替换为公网
  - 172.20.213.xx  #请替换为私网
  - 10.96.0.1   #不要替换，此IP是API的集群地址，部分服务会用到
controlPlaneEndpoint: 47.74.22.13:6443 #替换为公网IP
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/12
--- 将默认调度方式改为ipvs
apiVersion: kubeproxy-config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
featureGates:
  SupportIPVSProxyMode: true
mode: ipvs
EOF

# 如果是1核心或者1G内存的请在末尾添加参数（--ignore-preflight-errors=all），否则会初始化失败!
# 同时注意，此步骤成功后，会打印，两个重要信息!

kubeadm init --config=kubeadm-config.yaml 
```

**注意：**
> 信息1 上面初始化成功后，将会生成kubeconfig文件，用于请求api服务器，请执行下面操作
> ```shell
> mkdir -p $HOME/.kube
> sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
> sudo chown $(id -u):$(id -g) $HOME/.kube/config
>```
> 信息2 此信息用于后面工作节点加入主节点使用
>```shell
>kubeadm join 123.57.36.xx:6443 --token abcdef.0123456789abcdef \
>    --discovery-token-ca-cert-hash sha256:28265e79f8695cf2ad2e23773e856c8b04c809b0e3b3d6f5e01fb1b543341065
> ```
### 5.5 配置kube-apiserver参数（master）
```shell
# 修改两个信息，添加--bind-address和修改--advertise-address
vim /etc/kubernetes/manifests/kube-apiserver.yaml

apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: 123.57.36.xx:6443
  creationTimestamp: null
  labels:
    component: kube-apiserver
    tier: control-plane
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    - --advertise-address=123.57.36.xx  #修改为公网IP
    - --bind-address=0.0.0.0 #添加此参数
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    - --enable-admission-plugins=NodeRestriction
    - --enable-bootstrap-token-auth=true
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    - --etcd-servers=https://127.0.0.1:2379
    - --insecure-port=0
    - --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt
    - --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key
    - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
    - --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt
    - --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key
    - --requestheader-allowed-names=front-proxy-client
    - --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt
    - --requestheader-extra-headers-prefix=X-Remote-Extra-
    - --requestheader-group-headers=X-Remote-Group
    - --requestheader-username-headers=X-Remote-User
    - --secure-port=6443
    - --service-account-key-file=/etc/kubernetes/pki/sa.pub
    - --service-cluster-ip-range=10.96.0.0/12
    - --tls-cert-file=/etc/kubernetes/pki/apiserver.crt
    - --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
    image: k8s.gcr.io/kube-apiserver:v1.18.0
    imagePullPolicy: IfNotPresent
    livenessProbe:
      failureThreshold: 8
      httpGet:
        host: 175.24.19.12
        path: /healthz
        port: 6443
        scheme: HTTPS
      initialDelaySeconds: 15
      timeoutSeconds: 15
    name: kube-apiserver
    resources:
      requests:
        cpu: 250m
    volumeMounts:
    - mountPath: /etc/ssl/certs
      name: ca-certs
      readOnly: true
    - mountPath: /etc/pki
      name: etc-pki
      readOnly: true
    - mountPath: /etc/kubernetes/pki
      name: k8s-certs
      readOnly: true
  hostNetwork: true
  priorityClassName: system-cluster-critical
  volumes:
  - hostPath:
      path: /etc/ssl/certs
      type: DirectoryOrCreate
    name: ca-certs
  - hostPath:
      path: /etc/pki
      type: DirectoryOrCreate
    name: etc-pki
  - hostPath:
      path: /etc/kubernetes/pki
      type: DirectoryOrCreate
    name: k8s-certs
status: {}
```
### 5.6 Node点加入集群（node1，node2）
```shell
# 需要虚拟IP和kubelet启动参数都改成功后，再执行
kubeadm join 123.57.36.xx:6443 --token abcdef.0123456789abcdef \
   --discovery-token-ca-cert-hash sha256:28265e79f8695cf2ad2e23773e856c8b04c809b0e3b3d6f5e01fb1b543341065
```
### 5.7 检查是否加入集群（Master）
```shell
# 成功后，INTERNAL-IP均显示公网IP
kubectl get nodes -o wide
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/cbb6ec40e5c24fd5b8ca39c23ef52a89.png)
### 5.8 配置flannel文件并安装（Master）
```shell
#创建目录
mkdir -pv /var/lib/k8s/flannel
#下载flannel网络插件
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# 共修改两个地方，一个是args下，添加
 args:
 - --public-ip=$(PUBLIC_IP) # 添加此参数，申明公网IP
 - --iface=eth0             # 添加此参数，绑定网卡
 
 # 然后是env下
 env:
 - name: PUBLIC_IP     #添加环境变量
   valueFrom:          
     fieldRef:          
       fieldPath: status.podIP 

```
**kube-flannel.yml完整配置**
```yml
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: psp.flannel.unprivileged
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: docker/default
    seccomp.security.alpha.kubernetes.io/defaultProfileName: docker/default
    apparmor.security.beta.kubernetes.io/allowedProfileNames: runtime/default
    apparmor.security.beta.kubernetes.io/defaultProfileName: runtime/default
spec:
  privileged: false
  volumes:
    - configMap
    - secret
    - emptyDir
    - hostPath
  allowedHostPaths:
    - pathPrefix: "/etc/cni/net.d"
    - pathPrefix: "/etc/kube-flannel"
    - pathPrefix: "/run/flannel"
  readOnlyRootFilesystem: false
  # Users and groups
  runAsUser:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  # Privilege Escalation
  allowPrivilegeEscalation: false
  defaultAllowPrivilegeEscalation: false
  # Capabilities
  allowedCapabilities: ['NET_ADMIN', 'NET_RAW']
  defaultAddCapabilities: []
  requiredDropCapabilities: []
  # Host namespaces
  hostPID: false
  hostIPC: false
  hostNetwork: true
  hostPorts:
    - min: 0
      max: 65535
  # SELinux
  seLinux:
    # SELinux is unused in CaaSP
    rule: 'RunAsAny'
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: flannel
rules:
  - apiGroups: ['extensions']
    resources: ['podsecuritypolicies']
    verbs: ['use']
    resourceNames: ['psp.flannel.unprivileged']
  - apiGroups:
      - ""
    resources:
      - pods
    verbs:
      - get
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - list
      - watch
  - apiGroups:
      - ""
    resources:
      - nodes/status
    verbs:
      - patch
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: flannel
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: flannel
subjects:
  - kind: ServiceAccount
    name: flannel
    namespace: kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: flannel
  namespace: kube-system
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: kube-flannel-cfg
  namespace: kube-system
  labels:
    tier: node
    app: flannel
data:
  cni-conf.json: |
    {
      "name": "cbr0",
      "cniVersion": "0.3.1",
      "plugins": [
        {
          "type": "flannel",
          "delegate": {
            "hairpinMode": true,
            "isDefaultGateway": true
          }
        },
        {
          "type": "portmap",
          "capabilities": {
            "portMappings": true
          }
        }
      ]
    }
  net-conf.json: |
    {
      "Network": "10.244.0.0/16",
      "Backend": {
        "Type": "vxlan"
      }
    }
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: kube-flannel-ds
  namespace: kube-system
  labels:
    tier: node
    app: flannel
spec:
  selector:
    matchLabels:
      app: flannel
  template:
    metadata:
      labels:
        tier: node
        app: flannel
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/os
                    operator: In
                    values:
                      - linux
      hostNetwork: true
      priorityClassName: system-node-critical
      tolerations:
        - operator: Exists
          effect: NoSchedule
      serviceAccountName: flannel
      initContainers:
        - name: install-cni-plugin
          image: rancher/mirrored-flannelcni-flannel-cni-plugin:v1.2
          command:
            - cp
          args:
            - -f
            - /flannel
            - /opt/cni/bin/flannel
          volumeMounts:
            - name: cni-plugin
              mountPath: /opt/cni/bin
        - name: install-cni
          image: quay.io/coreos/flannel:v0.15.0
          command:
            - cp
          args:
            - -f
            - /etc/kube-flannel/cni-conf.json
            - /etc/cni/net.d/10-flannel.conflist
          volumeMounts:
            - name: cni
              mountPath: /etc/cni/net.d
            - name: flannel-cfg
              mountPath: /etc/kube-flannel/
      containers:
        - name: kube-flannel
          image: quay.io/coreos/flannel:v0.15.0
          command:
            - /opt/bin/flanneld
          args:
            - --ip-masq
            - --kube-subnet-mgr
            - --public-ip=$(PUBLIC_IP)
            - --iface=eth0
          resources:
            requests:
              cpu: "100m"
              memory: "50Mi"
            limits:
              cpu: "100m"
              memory: "50Mi"
          securityContext:
            privileged: false
            capabilities:
              add: ["NET_ADMIN", "NET_RAW"]
          env:
            - name: PUBLIC_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          volumeMounts:
            - name: run
              mountPath: /run/flannel
            - name: flannel-cfg
              mountPath: /etc/kube-flannel/
      volumes:
        - name: run
          hostPath:
            path: /run/flannel
        - name: cni-plugin
          hostPath:
            path: /opt/cni/bin
        - name: cni
          hostPath:
            path: /etc/cni/net.d
        - name: flannel-cfg
          configMap:
            name: kube-flannel-cfg

```
### 5.9 创建flannel
```shell
kubectl apply -f flannel.yaml
```
### 5.10 检查网络是否连通(master)
```shell
# 检查pod是否都是ready状态
kubectl get pods -o wide --all-namespaces
...

# 手动创建一个pod
kubectl create deployment nginx --image=nginx

# 查看pod的ip
kubectl get pods -o wide

# 主节点或其它节点，ping一下此ip,看看是否能ping通

# 没有的话，查看2.9章节中说明的端口是否打开
```
### 5.11 手动开启配置，开启ipvs转发模式（master）
```shell
# 前面都成功了，但是有时候默认并不会启用`IPVS`模式，那就手动修改一下，只修改一处
# 修改后，如果没有及时生效，请删除kube-proxy，会自动重新创建，然后使用ipvsadm -Ln命令，查看是否生效
# ipvsadm没有安装的，使用yum install ipvsadm安装
kubectl edit configmaps -n kube-system kube-proxy

---
apiVersion: v1
data:
  config.conf: |-
    apiVersion: kubeproxy.config.k8s.io/v1alpha1
    bindAddress: 0.0.0.0
    clientConnection:
      acceptContentTypes: ""
      burst: 0
      contentType: ""
      kubeconfig: /var/lib/kube-proxy/kubeconfig.conf
      qps: 0
    clusterCIDR: 10.244.0.0/16
    configSyncPeriod: 0s
    conntrack:
      maxPerCore: null
      min: null
      tcpCloseWaitTimeout: null
      tcpEstablishedTimeout: null
    detectLocalMode: ""
    enableProfiling: false
    healthzBindAddress: ""
    hostnameOverride: ""
    iptables:
      masqueradeAll: false
      masqueradeBit: null
      minSyncPeriod: 0s
      syncPeriod: 0s
    ipvs:
      excludeCIDRs: null
      minSyncPeriod: 0s
      scheduler: ""
      strictARP: false
      syncPeriod: 0s
      tcpFinTimeout: 0s
      tcpTimeout: 0s
      udpTimeout: 0s
    kind: KubeProxyConfiguration
    metricsBindAddress: ""
    mode: "ipvs"  # 如果为空，请填入`ipvs`
    nodePortAddresses: null
    oomScoreAdj: null
    portRange: ""
    showHiddenMetricsForVersion: ""
    udpIdleTimeout: 0s
    winkernel:
      enableDSR: false
      networkName: ""
```

**预期结果如下图：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/2798a6ac29e7433fad8bb105120b7f5f.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 5.12 移除虚拟网卡(非必须)
> 注意： 此步骤，可以不执行，因为实测不移除，节点间的网络也通了，如果是centos8网络不通，再执行下面的操作，移除虚拟虚拟网卡

```shell
 # 移除虚拟网卡
 mv /etc/sysconfig/network-scripts/ifcfg-eth0\:1 /root/
 # 重启
 reboot
```
##  六、安装默认的StorageClass
### 6.1 master和node节点安装nfs服务(master，node1，node2 )
```shell
yum -y install nfs-utils rpcbind
#启动nfs并设为开机自启
systemctl start nfs && systemctl enable nfs
systemctl start rpcbind && systemctl enable rpcbind
```
### 6.2 master节点创建共享挂载目录（客户端不需要创建共享目录和编辑配置文件，只安装服务就行）
```shell
mkdir -pv /data/volumes/{v1,v2,v3}
```
### 6.3 编辑master节点/etc/exports文件,将目录共享到*所有网段中：（网段根据自己的情况写）
```shell
cat /etc/exports <<EOF
/data/volumes/v1  *(rw,no_root_squash,no_all_squash)
/data/volumes/v2  *(rw,no_root_squash,no_all_squash)
/data/volumes/v3  *(rw,no_root_squash,no_all_squash)
EOF

# 发布
exportfs -arv
# 查看
showmount -e
```
**注意：**
> \* 表示所有网段支持，192.168.200.0/24表示指定网段才支持访问。

### 6.4 master主节点下载 NFS 插件(master)
```shell
#创建目录
mkdir -pv /var/lib/k8s/storage
#----------------------------
for file in class.yaml deployment.yaml rbac.yaml test-claim.yaml ; do wget https://raw.githubusercontent.com/kubernetes-incubator/external-storage/master/nfs-client/deploy/$file ; done
```
### 6.5 修改deployment.yaml文件
```yml
vim deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest     ##默认是latest版本
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs          ##这里的供应者名称必须和class.yaml中的provisioner的名称一致，否则部署不成功
            - name: NFS_SERVER
              value: 123.57.36.19           ##这里写NFS服务器的IP地址或者能解析到的主机名
            - name: NFS_PATH
              value: /data/volumes/v1        ##这里写NFS服务器中的共享挂载目录（强调：这里的路径必须是目录中最后一层的文件夹，否则部署的应用将无权限创建目录导致Pending）
      volumes:
        - name: nfs-client-root
          nfs:
            server: 123.57.36.19            ##NFS服务器的IP或可解析到的主机名 
            path: /data/volumes/v1           ##NFS服务器中的共享挂载目录（强调：这里的路径必须是目录中最后一层的文件夹，否则部署的应用将无权限创建目录导致Pending）
```
### 6.6 部署yml文件
```shell
kubectl apply -f .
```
### 6.7 验证安装
**查看服务：**
```shell
kubectl get pods
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/f8bf5c3507874ffc8926a2a0d4568b9e.png)
**列出你的集群中的StorageClass：**
```shell
kubectl get storageclass
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/279107eecdd34a5a87336d4aef5f526e.png)
**标记一个StorageClass为默认的:**
```shell
kubectl patch storageclass managed-nfs-storage -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```
```shell
kubectl get storageclass
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/f5db8dcdcadf499f81bd4839808a8351.png)
### 6.8 测试文件
```shell
#创建测试文件并写入yml配置
cat statefulset-nfs.yaml << EOF
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nfs-web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nfs-web # has to match .spec.template.metadata.labels
  template:
    metadata:
      labels:
        app: nfs-web
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
      annotations:
        volume.beta.kubernetes.io/storage-class: managed-nfs-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
EOF

# 安装测试用例
kubectl apply -f statefulset-nfs.yaml
```
**查看pod：**
```shell
[root@zanzancloud-k8s-master ~]# kubectl get pods
NAME                                      READY   STATUS    RESTARTS   AGE
nfs-client-provisioner-6d4469b5b5-m6jgp   1/1     Running   1          47h
nfs-web-0                                 1/1     Running   0          44m
nfs-web-1                                 1/1     Running   0          44m
nfs-web-2                                 1/1     Running   0          43m
```
**查看pvc:**
```shell
[root@zanzancloud-k8s-master ~]# kubectl get pvc
NAME            STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
test-claim      Bound    pvc-5dc58dfa-bd9d-4ad3-98c4-28649c13113c   1Mi        RWX            managed-nfs-storage   47h
www-nfs-web-0   Bound    pvc-7cdcdc4c-e9d2-4848-b434-9caf7e72db5a   1Gi        RWO            managed-nfs-storage   45m
www-nfs-web-1   Bound    pvc-23e3cdb2-a365-43ff-8936-d0e3df30ffac   1Gi        RWO            managed-nfs-storage   44m
www-nfs-web-2   Bound    pvc-2c34b87d-4f09-4063-aea9-9ae1e7567194   1Gi        RWO            managed-nfs-storage   44m
```
**查看pv:**
```shell
[root@zanzancloud-k8s-master ~]# kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                             STORAGECLASS          REASON   AGE
pvc-23e3cdb2-a365-43ff-8936-d0e3df30ffac   1Gi        RWO            Delete           Bound    default/www-nfs-web-1                                             managed-nfs-storage            45m
pvc-2c34b87d-4f09-4063-aea9-9ae1e7567194   1Gi        RWO            Delete           Bound    default/www-nfs-web-2                                             managed-nfs-storage            45m
pvc-5dc58dfa-bd9d-4ad3-98c4-28649c13113c   1Mi        RWX            Delete           Bound    default/test-claim                                                managed-nfs-storage            47h
pvc-7bf72c3c-be16-43ab-b43a-a84659b9c688   20Gi       RWO            Delete           Bound    kubesphere-monitoring-system/prometheus-k8s-db-prometheus-k8s-1   managed-nfs-storage            45h
pvc-7cdcdc4c-e9d2-4848-b434-9caf7e72db5a   1Gi        RWO            Delete           Bound    default/www-nfs-web-0                                             managed-nfs-storage            46m
pvc-dfac2b35-6c22-487e-baee-f381c44a5254   20Gi       RWO            Delete           Bound    kubesphere-monitoring-system/prometheus-k8s-db-prometheus-k8s-0   managed-nfs-storage            45h
```
**查看 nfs server 目录中信息:**
```shell
[root@zanzancloud-k8s-master ~]# ll /data/volumes/v1
total 0
drwxrwxrwx 2 root root  6 Feb 11 15:58 default-test-claim-pvc-5dc58dfa-bd9d-4ad3-98c4-28649c13113c
drwxrwxrwx 2 root root  6 Feb 11 10:35 default-test-claim-pvc-b68c2fde-14eb-464a-8907-f778a654e8b8
drwxrwxrwx 2 root root  6 Feb 13 14:30 default-www-nfs-web-0-pvc-7cdcdc4c-e9d2-4848-b434-9caf7e72db5a
drwxrwxrwx 2 root root  6 Feb 13 14:31 default-www-nfs-web-1-pvc-23e3cdb2-a365-43ff-8936-d0e3df30ffac
drwxrwxrwx 2 root root  6 Feb 13 14:31 default-www-nfs-web-2-pvc-2c34b87d-4f09-4063-aea9-9ae1e7567194
drwxrwxrwx 3 root root 27 Feb 13 14:44 kubesphere-monitoring-system-prometheus-k8s-db-prometheus-k8s-0-pvc-dfac2b35-6c22-487e-baee-f381c44a5254
drwxrwxrwx 3 root root 27 Feb 13 14:44 kubesphere-monitoring-system-prometheus-k8s-db-prometheus-k8s-1-pvc-7bf72c3c-be16-43ab-b43a-a84659b9c688
```
## 七、安装kubeSphere监控
### 7.1 kubeSphere架构
![在这里插入图片描述](https://img-blog.csdnimg.cn/0e6d007f66b34008a6e32ed684152b9d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)
### 7.2 环境要求
> 前提条件：
1.k8s集群版本必须是1.18.x（v1.18.6）
2.必须有默认的storageclass(上面已经安装)
3.内存和cpu最低要求：CPU > 1 Core, Memory > 2 G

### 7.3.安装yaml文件 （先安装第一个，再安装第二个）
```shell
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
   
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```
### 7.4 安装日志查看(中间需要等待时间)
```shell
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```
### 7.5 查看所有pod
```shell
[root@zanzancloud-k8s-master ~]# kubectl get pod -A
NAMESPACE                      NAME                                               READY   STATUS    RESTARTS   AGE
default                        nfs-client-provisioner-57944b54d5-mv895            1/1     Running   5          2d3h
kube-system                    coredns-66bff467f8-k67hr                           1/1     Running   7          3d23h
kube-system                    coredns-66bff467f8-pvlbn                           1/1     Running   7          3d23h
kube-system                    etcd-zanzancloud-k8s-master                        1/1     Running   8          3d23h
kube-system                    kube-apiserver-zanzancloud-k8s-master              1/1     Running   7          3d21h
kube-system                    kube-controller-manager-zanzancloud-k8s-master     1/1     Running   19         3d23h
kube-system                    kube-flannel-ds-6tjtn                              1/1     Running   3          3d
kube-system                    kube-flannel-ds-b2c6w                              1/1     Running   3          3d
kube-system                    kube-flannel-ds-vdssz                              1/1     Running   4          3d
kube-system                    kube-proxy-dv252                                   1/1     Running   6          3d23h
kube-system                    kube-proxy-gfxcv                                   1/1     Running   8          3d23h
kube-system                    kube-proxy-mmqff                                   1/1     Running   6          3d23h
kube-system                    kube-scheduler-zanzancloud-k8s-master              1/1     Running   18         3d23h
kube-system                    snapshot-controller-0                              1/1     Running   0          2d2h
kubesphere-controls-system     default-http-backend-857d7b6856-vhv55              1/1     Running   0          2d2h
kubesphere-controls-system     kubectl-admin-58f985d8f6-lfhc7                     1/1     Running   0          2d2h
kubesphere-monitoring-system   alertmanager-main-0                                2/2     Running   0          2d2h
kubesphere-monitoring-system   alertmanager-main-1                                2/2     Running   0          2d2h
kubesphere-monitoring-system   alertmanager-main-2                                2/2     Running   0          2d2h
kubesphere-monitoring-system   kube-state-metrics-95c974544-2jxp2                 3/3     Running   0          2d2h
kubesphere-monitoring-system   node-exporter-7crqm                                2/2     Running   0          2d2h
kubesphere-monitoring-system   node-exporter-jf5zs                                2/2     Running   2          2d2h
kubesphere-monitoring-system   node-exporter-kfpg9                                2/2     Running   0          2d2h
kubesphere-monitoring-system   notification-manager-deployment-7c8df68d94-mc2fr   1/1     Running   0          2d2h
kubesphere-monitoring-system   notification-manager-deployment-7c8df68d94-tqlqm   1/1     Running   0          2d2h
kubesphere-monitoring-system   notification-manager-operator-6958786cd6-rbkcn     2/2     Running   2          40h
kubesphere-monitoring-system   prometheus-k8s-0                                   3/3     Running   11         2d2h
kubesphere-monitoring-system   prometheus-k8s-1                                   3/3     Running   11         2d2h
kubesphere-monitoring-system   prometheus-operator-84d58bf775-x5mm2               2/2     Running   3          2d2h
kubesphere-system              ks-apiserver-686f9d89f5-md894                      1/1     Running   2          40h
kubesphere-system              ks-console-b4df86d6f-kqh98                         1/1     Running   0          2d2h
kubesphere-system              ks-controller-manager-5b85577bdb-2kf9k             1/1     Running   5          2d2h
kubesphere-system              ks-installer-7cb866bd-krx6k                        1/1     Running   0          2d2h
kubesphere-system              openldap-0                                         1/1     Running   0          2d2h
kubesphere-system              redis-644bc597b9-t7brt                             1/1     Running   0          2d2h
```
### 7.6 访问kubesphere
> 访问地址：ip:30880
> 账号：admin 密码： P@88w0rd

![在这里插入图片描述](https://img-blog.csdnimg.cn/41d3b2d6a0ee4b52897a45669eef5601.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5oqA5pyv5o-P6L-w5Lq655Sf,size_20,color_FFFFFF,t_70,g_se,x_16)

## 八、总结
> 呀呀呀，总算折腾完了，经过几天不懈努力，从网络到k8s集群，再到监控端，废了九牛二虎之力，上诉流程是经过折腾总结的经验，希望对于你有所帮助！！