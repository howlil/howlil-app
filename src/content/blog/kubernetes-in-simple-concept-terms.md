---
title: 'Kubernetes in Simple Concept Terms'
date: '08-11-2025'
category: 'Technology'
excerpt: 'A beginners journey learning Kubernetes, from setting up a control VM to understanding Kubernetes architecture, pods, and namespaces.'
tags: ['kubernetes', 'devops', 'learning', 'infrastructure']
coverImage: '/images/blog/kubernete-simple-concept.jpg'
---

<!-- @format -->

A few days ago, I started learning about Kubernetes. I tried to keep it simple and more practical, something that makes sense for a beginner like me, especially for people who haven't worked with tons of container projects. Still, as someone who's curious about how things actually work, I just want to share my experience.

This article is related to [citadel](https://github.com/IloveNooodles/citadel), but I want to explain it from my own point of view. I currently have access to an on-premise data center that's managed using Proxmox for virtualization (proxmox: make my physical data center accessible and manageable like a cloud environment). Something that I could manage through code instead of manual clicking and configuration.

## My Setup: A Control VM

Before creating any Kubernetes nodes, I first set up one special VM. This VM doesn't run Kubernetes; instead, it works as my control center to manage everything.

In this VM, I installed:

- **Terraform**: to create and configure VMs in Proxmox using code
- **kubectl**: to interact with the Kubernetes cluster
- **Helm**: to install and manage applications
- **talosctl**: to communicate with Talos Linux nodes

Since Talos OS doesn't allow SSH access, I can't log in directly to my Kubernetes machines. Everything must be handled remotely, and that's exactly what this control VM is made for.

## Understanding Kubernetes Architecture

Kubernetes is built around two main components:

1. Kubernetes Control Plane (Master)
2. Kubernetes Worker Node

### What the Kubernetes Master Does

The control plane is where all decisions happen. It doesn't run the apps, it manages them.

Key components include:

- **kube-api server**: accepts all requests (from kubectl, Helm etc.).
- **kube-scheduler**: decides which node should run each pod.
- **etcd**: stores all the cluster's data, like a database for Kubernetes.
- **kube controller manager**: constantly checks if the actual state matches the desired state.

### What the Kubernetes Worker Does

If the master is the brain, then the workers are the hands, they actually run the applications. Each worker node runs:

- **kubelet**: talks to the master and runs pods
- **kube proxy**: handles internal networking and service routing.
- **pod**: the smallest runnable units that hold your application containers.

## Understanding Pods and Namespaces

One pod can have multiple containers, depending on what you install inside it. For example, in a simple app, I might combine a backend container and a database container in one pod. But usually, each pod just runs one container.

Then I wondered: How do I organize my projects? That's where namespaces come in. Think of a namespace as a folder that groups your pods and resources together. It helps you separate and manage different projects easily within the same cluster.

**For Example:**

```
collage-projects [namespace]
├── pod-1 → backend container (worker 1)
├── pod-2 → frontend container (worker 2)
└── pod-3 → database container (worker 2)
```

Even though these pods belong to the same namespace, they can run on different worker nodes.

## My Architecture Setup

In my Proxmox environment, I have:

1. **Control VM**: Contains Terraform, Helm, kubectl, and talosctl for managing the cluster
2. **VM: Kubernetes Master**: Runs the control plane components (kube-api server, etcd, scheduler, controller-manager)
3. **VM: Kubernetes Worker 1**: Runs kubelet, kube-proxy, and application pods
4. **VM: Kubernetes Worker 2**: Runs kubelet, kube-proxy, and application pods

The master communicates with workers through the kube-api server, which sends instructions to kubelet and kube-proxy on each worker node. This allows the cluster to distribute workloads across multiple nodes while maintaining centralized control.

## Acknowledgment

This explanation might not be perfectly accurate, and there could be mistakes in how I understand or describe certain parts of Kubernetes. I'm still learning, and my setup may even sound a bit over-engineered for small personal projects. But that's exactly the point, this is a learning experiment.

Building and managing this setup helped me see how real infrastructure works. Even if it's more complex than what I actually need right now, it taught me the foundations of automation, orchestration, and system design that I can apply anywhere later.
