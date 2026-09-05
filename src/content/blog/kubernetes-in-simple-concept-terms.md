---
title: 'Kubernetes in Simple Concept Terms'
date: '2025-11-08'
category: 'Technology'
excerpt: 'A beginner’s learning note on running Kubernetes with Proxmox, Talos Linux, Terraform, and a dedicated control VM.'
tags: ['kubernetes', 'devops', 'learning', 'infrastructure']
coverImage: '/images/blog/kubernete-simple-concept.jpg'
---

<!-- @format -->

I started learning Kubernetes by building a small cluster on an on-premise Proxmox environment. Instead of trying to memorize every Kubernetes object first, I wanted to understand the path from infrastructure to a running workload.

This note documents that learning setup. It is related to [citadel](https://github.com/IloveNooodles/citadel), but the goal here is narrower: explain the mental model I use to understand the pieces and where each management tool belongs.

## The setup I wanted

I wanted the physical environment to behave more like infrastructure I could reproduce from code. Proxmox provides the virtualization layer, while Terraform creates and configures the virtual machines used by the cluster.

Before creating Kubernetes nodes, I made one separate **control VM** for the tools I use to manage the environment. This machine is not part of the Kubernetes control plane and does not run application workloads.

It contains:

- **Terraform** to provision virtual machines in Proxmox;
- **kubectl** to communicate with the Kubernetes API;
- **Helm** to install and manage packaged Kubernetes applications;
- **talosctl** to configure and inspect Talos Linux nodes.

Talos is intentionally managed through its API rather than a normal SSH-based administration workflow. Keeping the management tools on one control VM gave me one predictable place from which to operate the lab.

## The Kubernetes mental model

At a high level, I think about the cluster as two responsibilities: the **control plane** maintains the desired cluster state, while **worker nodes** run the workloads.

### What the control plane does

The control plane contains the components that coordinate the cluster rather than the application containers themselves.

The components I needed to understand first were:

- **kube-apiserver** — the main API surface used by clients and other Kubernetes components;
- **etcd** — the distributed key-value store that holds Kubernetes cluster state;
- **kube-scheduler** — selects an appropriate node for newly created Pods that do not yet have one;
- **kube-controller-manager** — runs controllers that continuously reconcile actual state toward desired state.

The word **reconcile** was the most useful concept for me. Kubernetes is not simply a sequence of commands sent from one machine to another. Controllers keep observing state and taking actions when reality differs from what has been declared.

### What a worker node does

Worker nodes provide the compute where Pods actually run.

A worker typically includes:

- **kubelet** — the node agent that watches the desired Pod state assigned to its node and works with the container runtime to keep those Pods running;
- **kube-proxy** — one implementation of Kubernetes Service networking on a node;
- a **container runtime** — runs the containers that make up Pods.

This helped me separate two ideas that initially looked similar: the control plane decides and records desired cluster state, while node-level components make the assigned workload real on each worker.

## Pods and namespaces

A **Pod** is the smallest deployable unit Kubernetes schedules. A Pod can contain more than one container, but those containers share a lifecycle and network context, so I do not treat a Pod as a generic place to bundle unrelated services together.

A common multi-container case is an application container plus a tightly coupled helper or sidecar. A database with its own persistence and lifecycle is usually better treated as a separate workload rather than placed in the same Pod as the application only for convenience.

A **namespace** provides a logical scope for grouping and naming Kubernetes resources. In my lab, it is useful for separating projects or environments without pretending that a namespace is a complete security boundary by itself.

For example:

```
college-projects [namespace]
├── backend-pod  → worker 1
├── frontend-pod → worker 2
└── database-pod → worker 2
```

Resources in the same namespace can still run on different worker nodes. The namespace groups Kubernetes objects; it does not pin them to one machine.

## How my lab fits together

My current Proxmox setup is intentionally small:

1. **Control VM** — Terraform, Helm, kubectl, and talosctl;
2. **Control-plane VM** — Kubernetes control-plane components;
3. **Worker VM 1** — node services and application workloads;
4. **Worker VM 2** — node services and application workloads.

Terraform manages the virtual-machine layer. Talos provides the node operating system and API-driven machine management. Kubernetes then manages cluster resources and workload scheduling above those machines.

`kubectl` and other clients communicate with the Kubernetes API server. The control-plane components update cluster state, and kubelets on worker nodes continuously observe the Pods assigned to their nodes and reconcile the local runtime toward that desired state.

That model is more accurate than thinking of the API server as directly pushing every instruction to every worker.

## What I learned from building it

The useful lesson was not that every personal project needs Kubernetes. For a small application, this environment is intentionally more complex than necessary.

The value was seeing several infrastructure boundaries in one system: provisioning virtual machines, configuring immutable nodes, declaring cluster state, scheduling workloads, and operating everything through APIs instead of manual server setup.

I am still learning this stack, so I treat this page as a working engineering note rather than an authoritative Kubernetes reference. As my understanding changes, I would rather correct the model than preserve an explanation just because it was written first.
