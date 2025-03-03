--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64),
    details_json text
);


ALTER TABLE public.admin_event_entity OWNER TO keycloak;

--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO keycloak;

--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO keycloak;

--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO keycloak;

--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO keycloak;

--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO keycloak;

--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO keycloak;

--
-- Name: client; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO keycloak;

--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO keycloak;

--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO keycloak;

--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO keycloak;

--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO keycloak;

--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO keycloak;

--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO keycloak;

--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO keycloak;

--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO keycloak;

--
-- Name: component; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO keycloak;

--
-- Name: component_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.component_config OWNER TO keycloak;

--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO keycloak;

--
-- Name: credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.credential OWNER TO keycloak;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO keycloak;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO keycloak;

--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO keycloak;

--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255),
    details_json_long_value text
);


ALTER TABLE public.event_entity OWNER TO keycloak;

--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024),
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.fed_user_attribute OWNER TO keycloak;

--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO keycloak;

--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO keycloak;

--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO keycloak;

--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO keycloak;

--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO keycloak;

--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO keycloak;

--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO keycloak;

--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO keycloak;

--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO keycloak;

--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO keycloak;

--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL,
    organization_id character varying(255),
    hide_on_login boolean DEFAULT false
);


ALTER TABLE public.identity_provider OWNER TO keycloak;

--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO keycloak;

--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO keycloak;

--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO keycloak;

--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36),
    type integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.keycloak_group OWNER TO keycloak;

--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO keycloak;

--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO keycloak;

--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL,
    version integer DEFAULT 0
);


ALTER TABLE public.offline_client_session OWNER TO keycloak;

--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL,
    broker_session_id character varying(1024),
    version integer DEFAULT 0
);


ALTER TABLE public.offline_user_session OWNER TO keycloak;

--
-- Name: org; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.org (
    id character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    realm_id character varying(255) NOT NULL,
    group_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(4000),
    alias character varying(255) NOT NULL,
    redirect_url character varying(2048)
);


ALTER TABLE public.org OWNER TO keycloak;

--
-- Name: org_domain; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.org_domain (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    verified boolean NOT NULL,
    org_id character varying(255) NOT NULL
);


ALTER TABLE public.org_domain OWNER TO keycloak;

--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO keycloak;

--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO keycloak;

--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO keycloak;

--
-- Name: realm; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO keycloak;

--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO keycloak;

--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO keycloak;

--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO keycloak;

--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO keycloak;

--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO keycloak;

--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO keycloak;

--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO keycloak;

--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO keycloak;

--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO keycloak;

--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO keycloak;

--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO keycloak;

--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO keycloak;

--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO keycloak;

--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO keycloak;

--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO keycloak;

--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO keycloak;

--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO keycloak;

--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO keycloak;

--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO keycloak;

--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO keycloak;

--
-- Name: revoked_token; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.revoked_token (
    id character varying(255) NOT NULL,
    expire bigint NOT NULL
);


ALTER TABLE public.revoked_token OWNER TO keycloak;

--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO keycloak;

--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO keycloak;

--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO keycloak;

--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.user_attribute OWNER TO keycloak;

--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO keycloak;

--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO keycloak;

--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO keycloak;

--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO keycloak;

--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO keycloak;

--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO keycloak;

--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO keycloak;

--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    membership_type character varying(255) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO keycloak;

--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO keycloak;

--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO keycloak;

--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.username_login_failure (
    realm_id character varying(36) NOT NULL,
    username character varying(255) NOT NULL,
    failed_login_not_before integer,
    last_failure bigint,
    last_ip_failure character varying(255),
    num_failures integer
);


ALTER TABLE public.username_login_failure OWNER TO keycloak;

--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO keycloak;

--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type, details_json) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
f0829dcb-92ff-4456-a9e5-6adc7a274d85	\N	auth-cookie	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	10	f	\N	\N
610dc6ef-f73a-4acc-8bb6-f7b5db607159	\N	auth-spnego	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	3	20	f	\N	\N
659667aa-123c-4ace-94dd-54aa998616ce	\N	identity-provider-redirector	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	25	f	\N	\N
80d70dbf-c708-43b0-bde2-59c78d96b622	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	30	t	37152b53-4ed5-474b-b5a3-2008d0447792	\N
e9d99147-452a-46b6-8647-7c9435c26a58	\N	auth-username-password-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	37152b53-4ed5-474b-b5a3-2008d0447792	0	10	f	\N	\N
7369afd9-0df5-416b-856c-343a4734108a	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	37152b53-4ed5-474b-b5a3-2008d0447792	1	20	t	5457a63f-f58e-4c9f-96c2-f4da20b34d41	\N
d634436c-30e4-4972-8298-b8e38c0c0c35	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5457a63f-f58e-4c9f-96c2-f4da20b34d41	0	10	f	\N	\N
8a276dfa-c487-44a9-8b2e-82bb10ce384b	\N	auth-otp-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5457a63f-f58e-4c9f-96c2-f4da20b34d41	0	20	f	\N	\N
1a232044-d008-4f7d-8225-bcacd651e679	\N	direct-grant-validate-username	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	0	10	f	\N	\N
1567061e-b4e2-4eee-b036-8ef2a7bd6c95	\N	direct-grant-validate-password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	0	20	f	\N	\N
cdcadcea-0ab0-4caf-9a8c-94887bbb0c48	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	1	30	t	4291e12f-4ec9-42cd-8c8a-062aefd541a3	\N
61fa555c-cdcd-4069-bf4a-cbe44cd69bb9	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4291e12f-4ec9-42cd-8c8a-062aefd541a3	0	10	f	\N	\N
06455974-4516-4a8c-8ca0-c307a1f4b192	\N	direct-grant-validate-otp	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4291e12f-4ec9-42cd-8c8a-062aefd541a3	0	20	f	\N	\N
18bd1364-f2af-4aa1-9290-045abbe80d00	\N	registration-page-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	21f9d306-af32-481c-9470-875328ef651d	0	10	t	1f914244-4fde-42fd-b6d0-1a0457835265	\N
6af17412-e2b9-43cd-8b42-a30ffdaa5a0d	\N	registration-user-creation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	0	20	f	\N	\N
ce3de24e-f961-43a1-ba63-54fe433de282	\N	registration-password-action	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	0	50	f	\N	\N
3539a58c-c969-42ef-8e24-a3b8158750f1	\N	registration-recaptcha-action	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	3	60	f	\N	\N
a32285d8-9738-4463-9db4-5f35a0c3f2a4	\N	registration-terms-and-conditions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	3	70	f	\N	\N
363c8eb2-bfcd-4f25-a84c-c01a06e15f83	\N	reset-credentials-choose-user	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	10	f	\N	\N
bdf83dbd-1b54-456d-a93c-9f00428da58d	\N	reset-credential-email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	20	f	\N	\N
14671b49-785c-4b6e-b950-4dee3c5a46bc	\N	reset-password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	30	f	\N	\N
d52e3aaa-31b2-4cfb-9397-ab4d2ee0e2b4	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	1	40	t	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	\N
2b981614-edce-48c3-b173-53d948019683	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	0	10	f	\N	\N
d2abe5b3-8b2d-4331-ae8d-32377fcd8ab2	\N	reset-otp	767d9b8d-d1e0-46e8-8336-872e7ee443dd	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	0	20	f	\N	\N
e6e4e763-68be-42ea-9650-d0a91a6d1bb7	\N	client-secret	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	10	f	\N	\N
93e25e1d-1bb3-419d-a865-caed652bd18e	\N	client-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	20	f	\N	\N
e6bd8e68-195a-4be4-b3a4-1f1f5f0cdc72	\N	client-secret-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	30	f	\N	\N
074a8baa-634e-42cc-90d1-e44c08e2acbc	\N	client-x509	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	40	f	\N	\N
e91fcfec-e5c3-4ef8-af9c-9c9125fb0488	\N	idp-review-profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5	0	10	f	\N	313de56f-94bc-414f-a07b-8dcf9863d112
7edb5f36-ba5c-4498-9656-ad4eb3051a58	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5	0	20	t	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	\N
b962b063-251f-4f09-bbb1-d751ed427120	\N	idp-create-user-if-unique	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	2	10	f	\N	4f14fbda-df74-4e0b-bb3c-2a5c1453e19e
4aa39619-8a72-4421-8cd5-79058f12e942	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	2	20	t	88c69553-e86b-46a4-b050-f6ae45fc7e34	\N
afe1edb2-a446-4c27-a2aa-b203e151cd22	\N	idp-confirm-link	767d9b8d-d1e0-46e8-8336-872e7ee443dd	88c69553-e86b-46a4-b050-f6ae45fc7e34	0	10	f	\N	\N
11407830-fad2-4a9e-9c03-4e06d0dd5612	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	88c69553-e86b-46a4-b050-f6ae45fc7e34	0	20	t	a56987cd-1b01-40c4-986b-d907fd49f9d8	\N
8fb247d5-8c1c-483f-86c7-84342dbb2b1f	\N	idp-email-verification	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a56987cd-1b01-40c4-986b-d907fd49f9d8	2	10	f	\N	\N
68b6071c-8d31-4550-8940-08b3452326cf	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a56987cd-1b01-40c4-986b-d907fd49f9d8	2	20	t	28531d8b-e767-466d-962e-114a67a31e64	\N
10530847-ef12-4b2c-8d94-68c557562829	\N	idp-username-password-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	28531d8b-e767-466d-962e-114a67a31e64	0	10	f	\N	\N
1fc8853c-358a-473f-b421-a8877f0fcec1	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	28531d8b-e767-466d-962e-114a67a31e64	1	20	t	7d95d05c-a9aa-40b3-be2b-884db4074e0c	\N
a15a9ad6-07f9-419f-8a10-5f3d39d25ab0	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	7d95d05c-a9aa-40b3-be2b-884db4074e0c	0	10	f	\N	\N
b7162a34-5b5d-4c8c-8716-a1b5619d5c5b	\N	auth-otp-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	7d95d05c-a9aa-40b3-be2b-884db4074e0c	0	20	f	\N	\N
28ca7b6f-c4a4-483a-8d3e-c414407a600d	\N	http-basic-authenticator	767d9b8d-d1e0-46e8-8336-872e7ee443dd	fb896d9b-8940-403e-b37c-dca4551a89d8	0	10	f	\N	\N
a79fb6c9-9528-49b3-9093-34cd5328eca5	\N	docker-http-basic-authenticator	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a9628e8a-0970-4232-9624-8e717c21b27f	0	10	f	\N	\N
679f0551-9bb2-46b3-9890-be39eb45d0fd	\N	auth-cookie	3dae0dec-5d92-4955-af55-89d9c775206b	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	2	10	f	\N	\N
2ced8f93-9c0e-408e-b3d6-6a85fb11853f	\N	auth-spnego	3dae0dec-5d92-4955-af55-89d9c775206b	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	3	20	f	\N	\N
31170932-95d6-43f7-9a1e-f048718fbbd7	\N	identity-provider-redirector	3dae0dec-5d92-4955-af55-89d9c775206b	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	2	25	f	\N	\N
e385df06-5fbf-4742-8a0c-686945f40e30	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	2	30	t	51c7e0b6-c0d7-4f56-a788-c8aaf80503af	\N
b7dd0af2-33d2-404c-ba52-3d6ff9a2db14	\N	auth-username-password-form	3dae0dec-5d92-4955-af55-89d9c775206b	51c7e0b6-c0d7-4f56-a788-c8aaf80503af	0	10	f	\N	\N
85c34ce6-8324-4d7c-ba1c-220c07b1f5bf	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	51c7e0b6-c0d7-4f56-a788-c8aaf80503af	1	20	t	79d94dfd-cdf1-4d78-95da-740e3afb1228	\N
79390935-1c2d-4fdf-8738-1753873283de	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	79d94dfd-cdf1-4d78-95da-740e3afb1228	0	10	f	\N	\N
7bac2aa8-7c7d-4baf-a95c-5a6e834206ce	\N	auth-otp-form	3dae0dec-5d92-4955-af55-89d9c775206b	79d94dfd-cdf1-4d78-95da-740e3afb1228	0	20	f	\N	\N
1dbf6cf1-cd3f-4e07-ae6e-a6a553edceb6	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	2	26	t	0bfbaa57-05f9-43ba-af81-80d1f9dda465	\N
5d066158-1f1e-4036-9fbf-3d430057e769	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	0bfbaa57-05f9-43ba-af81-80d1f9dda465	1	10	t	c726225e-7473-496d-95a8-4ec292c06bfa	\N
aebdddd6-c103-4145-bf72-c84610461853	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	c726225e-7473-496d-95a8-4ec292c06bfa	0	10	f	\N	\N
6f81c19a-ac26-4cbc-8274-2c82388bac9d	\N	organization	3dae0dec-5d92-4955-af55-89d9c775206b	c726225e-7473-496d-95a8-4ec292c06bfa	2	20	f	\N	\N
9526f31e-3ef3-48de-8f7c-8f534e548c93	\N	direct-grant-validate-username	3dae0dec-5d92-4955-af55-89d9c775206b	a5ea22ac-3bc7-4b80-9655-ea2faf3917d8	0	10	f	\N	\N
169990a7-7d1f-4719-9564-348dc5b6a0e8	\N	direct-grant-validate-password	3dae0dec-5d92-4955-af55-89d9c775206b	a5ea22ac-3bc7-4b80-9655-ea2faf3917d8	0	20	f	\N	\N
35352110-ea30-4487-954f-70ad3d433ea9	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	a5ea22ac-3bc7-4b80-9655-ea2faf3917d8	1	30	t	fb73ffe4-c0d3-40ed-89f7-7aa56d20976d	\N
bf7ba520-d6cf-4673-bc2d-82ac9be9fb21	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	fb73ffe4-c0d3-40ed-89f7-7aa56d20976d	0	10	f	\N	\N
06d51e8d-6d5b-4ab9-94b3-fd0bdbaed5bc	\N	direct-grant-validate-otp	3dae0dec-5d92-4955-af55-89d9c775206b	fb73ffe4-c0d3-40ed-89f7-7aa56d20976d	0	20	f	\N	\N
4b918e1c-0cbf-442a-a9ce-38a389b2876f	\N	registration-page-form	3dae0dec-5d92-4955-af55-89d9c775206b	85369751-981f-43ec-8615-17bee6e018f5	0	10	t	68ffb05a-1397-4359-86ab-048516c2e0ac	\N
b47f21de-8889-4c20-84ec-30750acfe90c	\N	registration-user-creation	3dae0dec-5d92-4955-af55-89d9c775206b	68ffb05a-1397-4359-86ab-048516c2e0ac	0	20	f	\N	\N
8147b828-cd43-44f3-88b5-00f41e4f0291	\N	registration-password-action	3dae0dec-5d92-4955-af55-89d9c775206b	68ffb05a-1397-4359-86ab-048516c2e0ac	0	50	f	\N	\N
810abc3a-e655-451c-8ff6-16f428e01421	\N	registration-recaptcha-action	3dae0dec-5d92-4955-af55-89d9c775206b	68ffb05a-1397-4359-86ab-048516c2e0ac	3	60	f	\N	\N
6b63533a-7186-45f0-858f-427aad73e132	\N	registration-terms-and-conditions	3dae0dec-5d92-4955-af55-89d9c775206b	68ffb05a-1397-4359-86ab-048516c2e0ac	3	70	f	\N	\N
7b6fbe3c-5356-4395-8127-f608a5436f9d	\N	reset-credentials-choose-user	3dae0dec-5d92-4955-af55-89d9c775206b	e3918048-6989-4172-8a52-75eeace095b0	0	10	f	\N	\N
60cac13e-21e9-4dd8-af9c-4e66a84de42d	\N	reset-credential-email	3dae0dec-5d92-4955-af55-89d9c775206b	e3918048-6989-4172-8a52-75eeace095b0	0	20	f	\N	\N
c8e3c08d-37ed-4493-9b04-e8b1b9d5c57a	\N	reset-password	3dae0dec-5d92-4955-af55-89d9c775206b	e3918048-6989-4172-8a52-75eeace095b0	0	30	f	\N	\N
f88c180d-ebe3-49ee-a0c3-5deea2409f8f	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	e3918048-6989-4172-8a52-75eeace095b0	1	40	t	cc473e68-bed0-48c3-857b-5d61793e1bfd	\N
cf2c8f04-c31d-4aab-aa83-f948a98a2b37	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	cc473e68-bed0-48c3-857b-5d61793e1bfd	0	10	f	\N	\N
8cb93983-b2fb-44ac-b022-8c46c38d5f32	\N	reset-otp	3dae0dec-5d92-4955-af55-89d9c775206b	cc473e68-bed0-48c3-857b-5d61793e1bfd	0	20	f	\N	\N
5454138a-fcaa-4abb-8f19-bb1958b22026	\N	client-secret	3dae0dec-5d92-4955-af55-89d9c775206b	edbd7083-d7b3-4713-a998-27662984b4f4	2	10	f	\N	\N
015e5f2f-e841-4fef-9671-e13953130e70	\N	client-jwt	3dae0dec-5d92-4955-af55-89d9c775206b	edbd7083-d7b3-4713-a998-27662984b4f4	2	20	f	\N	\N
5dcacbf8-64f8-4d19-8fb9-ce7f71f32a6c	\N	client-secret-jwt	3dae0dec-5d92-4955-af55-89d9c775206b	edbd7083-d7b3-4713-a998-27662984b4f4	2	30	f	\N	\N
1bf9c97f-93b0-4476-b010-15f4895a811d	\N	client-x509	3dae0dec-5d92-4955-af55-89d9c775206b	edbd7083-d7b3-4713-a998-27662984b4f4	2	40	f	\N	\N
56a05f39-0913-45cf-8fac-3e4e3bd1a0e7	\N	idp-review-profile	3dae0dec-5d92-4955-af55-89d9c775206b	061bbc0a-edc7-44af-a20d-579bd98e7cfe	0	10	f	\N	997cb38c-33ed-47c8-b406-d9c48686021f
de6c8d70-0ff6-4e7b-b355-3a1e85ec0605	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	061bbc0a-edc7-44af-a20d-579bd98e7cfe	0	20	t	66ef91b2-9a75-4fa1-b823-48290e72b6ce	\N
0cfc62ab-3da0-4c4d-b1bf-55eb65b27b1b	\N	idp-create-user-if-unique	3dae0dec-5d92-4955-af55-89d9c775206b	66ef91b2-9a75-4fa1-b823-48290e72b6ce	2	10	f	\N	ed9680d3-b558-4da7-8f51-98dbc5cba595
2457a4bd-65c4-444e-8ea9-67810edb9854	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	66ef91b2-9a75-4fa1-b823-48290e72b6ce	2	20	t	27bb2a66-66b2-4bff-b256-4aff4f939494	\N
9b53eb2a-de25-4a01-b252-dc01299f9c50	\N	idp-confirm-link	3dae0dec-5d92-4955-af55-89d9c775206b	27bb2a66-66b2-4bff-b256-4aff4f939494	0	10	f	\N	\N
13379e1f-a30a-4894-a429-20ec7be0c38d	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	27bb2a66-66b2-4bff-b256-4aff4f939494	0	20	t	a54f64c6-9df3-47d9-a0c3-8371853da636	\N
00b2db3e-3bdb-4635-b49b-263b1789c66f	\N	idp-email-verification	3dae0dec-5d92-4955-af55-89d9c775206b	a54f64c6-9df3-47d9-a0c3-8371853da636	2	10	f	\N	\N
9585a779-b2e0-40f6-a13e-fd0dbf6c340f	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	a54f64c6-9df3-47d9-a0c3-8371853da636	2	20	t	8c6f589b-925b-4e6b-bc03-9379d806fbff	\N
6deff39d-0c91-4988-8f36-d748f599a3ce	\N	idp-username-password-form	3dae0dec-5d92-4955-af55-89d9c775206b	8c6f589b-925b-4e6b-bc03-9379d806fbff	0	10	f	\N	\N
9816493c-17a3-47c6-b587-c4657fd22ff9	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	8c6f589b-925b-4e6b-bc03-9379d806fbff	1	20	t	8ad75dc8-22ac-4caa-bcf9-e7531d846d03	\N
51ea9bf9-0ff7-447b-9c4f-6a82ead0633a	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	8ad75dc8-22ac-4caa-bcf9-e7531d846d03	0	10	f	\N	\N
643a0c8f-a65c-4677-85ad-d364b4f05089	\N	auth-otp-form	3dae0dec-5d92-4955-af55-89d9c775206b	8ad75dc8-22ac-4caa-bcf9-e7531d846d03	0	20	f	\N	\N
476ed6fa-fa7a-4801-a935-d60570006655	\N	\N	3dae0dec-5d92-4955-af55-89d9c775206b	061bbc0a-edc7-44af-a20d-579bd98e7cfe	1	50	t	0710907d-0eee-4a8f-884a-b328c962c9c9	\N
491da7cb-52d0-44c2-a74a-01f0e13dfaa3	\N	conditional-user-configured	3dae0dec-5d92-4955-af55-89d9c775206b	0710907d-0eee-4a8f-884a-b328c962c9c9	0	10	f	\N	\N
e83b5850-5386-4e21-a036-987800a69e70	\N	idp-add-organization-member	3dae0dec-5d92-4955-af55-89d9c775206b	0710907d-0eee-4a8f-884a-b328c962c9c9	0	20	f	\N	\N
ca6960d6-4612-4eed-b656-ef44416bffe8	\N	http-basic-authenticator	3dae0dec-5d92-4955-af55-89d9c775206b	88b8362c-d6d4-4891-bad8-8e5b22eb0e77	0	10	f	\N	\N
a67e9ccc-1d02-4ad7-9127-0032d9adad01	\N	docker-http-basic-authenticator	3dae0dec-5d92-4955-af55-89d9c775206b	3dd6608e-13a6-48b6-96e7-55b71785ff53	0	10	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
b36c966b-92ac-4567-aaff-dda8c9cbdb1c	browser	browser based authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
37152b53-4ed5-474b-b5a3-2008d0447792	forms	Username, password, otp and other auth forms.	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
5457a63f-f58e-4c9f-96c2-f4da20b34d41	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
ca82d390-f8c8-4105-9f7f-95f0442a4563	direct grant	OpenID Connect Resource Owner Grant	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
4291e12f-4ec9-42cd-8c8a-062aefd541a3	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
21f9d306-af32-481c-9470-875328ef651d	registration	registration flow	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
1f914244-4fde-42fd-b6d0-1a0457835265	registration form	registration form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	form-flow	f	t
0f7db7b2-9608-4396-9da7-5ac0d23298e2	reset credentials	Reset credentials for a user if they forgot their password or something	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
eac7d096-07c5-4ab1-86ab-d7671c40ae6f	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
4166758c-a967-44ea-a50a-aead01198481	clients	Base authentication for clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	client-flow	t	t
c0358ec7-d894-4538-a00a-0564f3ad55e5	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	User creation or linking	Flow for the existing/non-existing user alternatives	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
88c69553-e86b-46a4-b050-f6ae45fc7e34	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
a56987cd-1b01-40c4-986b-d907fd49f9d8	Account verification options	Method with which to verity the existing account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
28531d8b-e767-466d-962e-114a67a31e64	Verify Existing Account by Re-authentication	Reauthentication of existing account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
7d95d05c-a9aa-40b3-be2b-884db4074e0c	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
fb896d9b-8940-403e-b37c-dca4551a89d8	saml ecp	SAML ECP Profile Authentication Flow	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
a9628e8a-0970-4232-9624-8e717c21b27f	docker auth	Used by Docker clients to authenticate against the IDP	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
50fca9d0-d75f-41c8-b40e-3a4008a1b82d	browser	Browser based authentication	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
51c7e0b6-c0d7-4f56-a788-c8aaf80503af	forms	Username, password, otp and other auth forms.	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
79d94dfd-cdf1-4d78-95da-740e3afb1228	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
0bfbaa57-05f9-43ba-af81-80d1f9dda465	Organization	\N	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
c726225e-7473-496d-95a8-4ec292c06bfa	Browser - Conditional Organization	Flow to determine if the organization identity-first login is to be used	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
a5ea22ac-3bc7-4b80-9655-ea2faf3917d8	direct grant	OpenID Connect Resource Owner Grant	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
fb73ffe4-c0d3-40ed-89f7-7aa56d20976d	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
85369751-981f-43ec-8615-17bee6e018f5	registration	Registration flow	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
68ffb05a-1397-4359-86ab-048516c2e0ac	registration form	Registration form	3dae0dec-5d92-4955-af55-89d9c775206b	form-flow	f	t
e3918048-6989-4172-8a52-75eeace095b0	reset credentials	Reset credentials for a user if they forgot their password or something	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
cc473e68-bed0-48c3-857b-5d61793e1bfd	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
edbd7083-d7b3-4713-a998-27662984b4f4	clients	Base authentication for clients	3dae0dec-5d92-4955-af55-89d9c775206b	client-flow	t	t
061bbc0a-edc7-44af-a20d-579bd98e7cfe	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
66ef91b2-9a75-4fa1-b823-48290e72b6ce	User creation or linking	Flow for the existing/non-existing user alternatives	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
27bb2a66-66b2-4bff-b256-4aff4f939494	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
a54f64c6-9df3-47d9-a0c3-8371853da636	Account verification options	Method with which to verity the existing account	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
8c6f589b-925b-4e6b-bc03-9379d806fbff	Verify Existing Account by Re-authentication	Reauthentication of existing account	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
8ad75dc8-22ac-4caa-bcf9-e7531d846d03	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
0710907d-0eee-4a8f-884a-b328c962c9c9	First Broker Login - Conditional Organization	Flow to determine if the authenticator that adds organization members is to be used	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	f	t
88b8362c-d6d4-4891-bad8-8e5b22eb0e77	saml ecp	SAML ECP Profile Authentication Flow	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
3dd6608e-13a6-48b6-96e7-55b71785ff53	docker auth	Used by Docker clients to authenticate against the IDP	3dae0dec-5d92-4955-af55-89d9c775206b	basic-flow	t	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
313de56f-94bc-414f-a07b-8dcf9863d112	review profile config	767d9b8d-d1e0-46e8-8336-872e7ee443dd
4f14fbda-df74-4e0b-bb3c-2a5c1453e19e	create unique user config	767d9b8d-d1e0-46e8-8336-872e7ee443dd
997cb38c-33ed-47c8-b406-d9c48686021f	review profile config	3dae0dec-5d92-4955-af55-89d9c775206b
ed9680d3-b558-4da7-8f51-98dbc5cba595	create unique user config	3dae0dec-5d92-4955-af55-89d9c775206b
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
313de56f-94bc-414f-a07b-8dcf9863d112	missing	update.profile.on.first.login
4f14fbda-df74-4e0b-bb3c-2a5c1453e19e	false	require.password.update.after.registration
997cb38c-33ed-47c8-b406-d9c48686021f	missing	update.profile.on.first.login
ed9680d3-b558-4da7-8f51-98dbc5cba595	false	require.password.update.after.registration
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	f	master-realm	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
cf8c636a-969c-4676-a664-99f5bcef27c3	t	f	broker	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	t	t	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
d1cc947f-0a2f-4975-81a4-877433a52648	t	t	admin-cli	0	t	\N	\N	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	f	measurestream-realm	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	0	f	f	measurestream Realm	f	client-secret	\N	\N	\N	t	f	f	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	f	realm-management	0	f	\N	\N	t	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f
d297f344-051c-4d34-8665-18b02a58d96c	t	f	account	0	t	\N	/realms/measurestream/account/	f	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	t	f	account-console	0	t	\N	/realms/measurestream/account/	f	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	t	f	broker	0	f	\N	\N	t	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
947eed23-7adc-4635-b18e-9c151c1aa27c	t	t	security-admin-console	0	t	\N	/admin/measurestream/console/	f	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
4532d7c3-8898-404e-99af-10ae9f158c85	t	t	admin-cli	0	t	\N	\N	f	\N	f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	t	t	gateway	0	f	i3KBTdwpup1nlOEJBNtQHTjFqiycCNQ4		f		f	3dae0dec-5d92-4955-af55-89d9c775206b	openid-connect	-1	t	f		f	client-secret			\N	t	f	t	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	post.logout.redirect.uris	+
21f5e158-9ae0-47eb-a8af-5e5413d0f224	post.logout.redirect.uris	+
21f5e158-9ae0-47eb-a8af-5e5413d0f224	pkce.code.challenge.method	S256
fec6b05c-1521-42c8-b5eb-e83a00d28125	post.logout.redirect.uris	+
fec6b05c-1521-42c8-b5eb-e83a00d28125	pkce.code.challenge.method	S256
fec6b05c-1521-42c8-b5eb-e83a00d28125	client.use.lightweight.access.token.enabled	true
d1cc947f-0a2f-4975-81a4-877433a52648	client.use.lightweight.access.token.enabled	true
d297f344-051c-4d34-8665-18b02a58d96c	post.logout.redirect.uris	+
4f9520df-706f-40c5-a2d3-761c3be7b1bf	post.logout.redirect.uris	+
4f9520df-706f-40c5-a2d3-761c3be7b1bf	pkce.code.challenge.method	S256
947eed23-7adc-4635-b18e-9c151c1aa27c	post.logout.redirect.uris	+
947eed23-7adc-4635-b18e-9c151c1aa27c	pkce.code.challenge.method	S256
947eed23-7adc-4635-b18e-9c151c1aa27c	client.use.lightweight.access.token.enabled	true
4532d7c3-8898-404e-99af-10ae9f158c85	client.use.lightweight.access.token.enabled	true
71d0319e-df6f-4a71-8f4a-353fc8b57122	client.secret.creation.time	1740493425
71d0319e-df6f-4a71-8f4a-353fc8b57122	oauth2.device.authorization.grant.enabled	true
71d0319e-df6f-4a71-8f4a-353fc8b57122	oidc.ciba.grant.enabled	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	backchannel.logout.session.required	true
71d0319e-df6f-4a71-8f4a-353fc8b57122	backchannel.logout.revoke.offline.tokens	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	realm_client	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	display.on.consent.screen	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	use.refresh.tokens	true
71d0319e-df6f-4a71-8f4a-353fc8b57122	client_credentials.use_refresh_token	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	token.response.type.bearer.lower-case	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	tls.client.certificate.bound.access.tokens	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	require.pushed.authorization.requests	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	client.use.lightweight.access.token.enabled	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	client.introspection.response.allow.jwt.claim.enabled	false
71d0319e-df6f-4a71-8f4a-353fc8b57122	acr.loa.map	{}
71d0319e-df6f-4a71-8f4a-353fc8b57122	login_theme	keycloak.v2
71d0319e-df6f-4a71-8f4a-353fc8b57122	post.logout.redirect.uris	http://localhost:8080/
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	offline_access	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: offline_access	openid-connect
a7c717f5-275c-4276-beef-8bb8e0322ad2	role_list	767d9b8d-d1e0-46e8-8336-872e7ee443dd	SAML role list	saml
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: profile	openid-connect
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: email	openid-connect
9fc9c2dc-e827-4104-a13f-3d2c84191815	address	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: address	openid-connect
865ea21d-5993-4a7f-ad32-27db092d5270	phone	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: phone	openid-connect
460b8e49-93f3-40a9-b2b9-974a31ef9adf	roles	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add user roles to the access token	openid-connect
9bf3ba39-3566-4bd5-b772-0214d0d50487	web-origins	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add allowed web origins to the access token	openid-connect
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	microprofile-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	Microprofile - JWT built-in scope	openid-connect
2d9c822f-439e-43e3-acf4-feb12d41f606	acr	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
9199e97e-bceb-40ea-92c5-3d174a10455e	basic	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add all basic claims to the token	openid-connect
9be2e5c8-7d15-46be-a7b3-04811cb8ec97	basic	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect scope for add all basic claims to the token	openid-connect
e0a36a51-2daf-4275-a163-5d03949f8dfe	offline_access	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect built-in scope: offline_access	openid-connect
77019f9f-423b-4bc8-bc80-9490337268d0	role_list	3dae0dec-5d92-4955-af55-89d9c775206b	SAML role list	saml
802b8283-0517-4e61-93df-33bb547efd6b	saml_organization	3dae0dec-5d92-4955-af55-89d9c775206b	Organization Membership	saml
40b02902-2943-4d35-8d99-6835d035fbec	profile	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect built-in scope: profile	openid-connect
83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	email	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect built-in scope: email	openid-connect
f1176d92-c514-43e6-894f-709142e29dd5	address	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect built-in scope: address	openid-connect
e810d4dd-4069-4853-8ac7-708ccc1ee092	phone	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect built-in scope: phone	openid-connect
6968fef2-dcf0-4af4-b3c9-936368437b29	roles	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect scope for add user roles to the access token	openid-connect
cc438969-bd98-4481-94da-976d776ebc57	web-origins	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect scope for add allowed web origins to the access token	openid-connect
39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	microprofile-jwt	3dae0dec-5d92-4955-af55-89d9c775206b	Microprofile - JWT built-in scope	openid-connect
ff161937-a987-4f12-af5b-3da8534c0835	acr	3dae0dec-5d92-4955-af55-89d9c775206b	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
cd17b920-5ad4-43bf-8a05-2969f69e80a4	organization	3dae0dec-5d92-4955-af55-89d9c775206b	Additional claims about the organization a subject belongs to	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	true	display.on.consent.screen
d699ef80-95f8-4619-a866-8a1af6f7ec64	${offlineAccessScopeConsentText}	consent.screen.text
a7c717f5-275c-4276-beef-8bb8e0322ad2	true	display.on.consent.screen
a7c717f5-275c-4276-beef-8bb8e0322ad2	${samlRoleListScopeConsentText}	consent.screen.text
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	true	display.on.consent.screen
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	${profileScopeConsentText}	consent.screen.text
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	true	include.in.token.scope
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	true	display.on.consent.screen
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	${emailScopeConsentText}	consent.screen.text
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	true	include.in.token.scope
9fc9c2dc-e827-4104-a13f-3d2c84191815	true	display.on.consent.screen
9fc9c2dc-e827-4104-a13f-3d2c84191815	${addressScopeConsentText}	consent.screen.text
9fc9c2dc-e827-4104-a13f-3d2c84191815	true	include.in.token.scope
865ea21d-5993-4a7f-ad32-27db092d5270	true	display.on.consent.screen
865ea21d-5993-4a7f-ad32-27db092d5270	${phoneScopeConsentText}	consent.screen.text
865ea21d-5993-4a7f-ad32-27db092d5270	true	include.in.token.scope
460b8e49-93f3-40a9-b2b9-974a31ef9adf	true	display.on.consent.screen
460b8e49-93f3-40a9-b2b9-974a31ef9adf	${rolesScopeConsentText}	consent.screen.text
460b8e49-93f3-40a9-b2b9-974a31ef9adf	false	include.in.token.scope
9bf3ba39-3566-4bd5-b772-0214d0d50487	false	display.on.consent.screen
9bf3ba39-3566-4bd5-b772-0214d0d50487		consent.screen.text
9bf3ba39-3566-4bd5-b772-0214d0d50487	false	include.in.token.scope
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	false	display.on.consent.screen
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	true	include.in.token.scope
2d9c822f-439e-43e3-acf4-feb12d41f606	false	display.on.consent.screen
2d9c822f-439e-43e3-acf4-feb12d41f606	false	include.in.token.scope
9199e97e-bceb-40ea-92c5-3d174a10455e	false	display.on.consent.screen
9199e97e-bceb-40ea-92c5-3d174a10455e	false	include.in.token.scope
e0a36a51-2daf-4275-a163-5d03949f8dfe	true	display.on.consent.screen
e0a36a51-2daf-4275-a163-5d03949f8dfe	${offlineAccessScopeConsentText}	consent.screen.text
77019f9f-423b-4bc8-bc80-9490337268d0	true	display.on.consent.screen
77019f9f-423b-4bc8-bc80-9490337268d0	${samlRoleListScopeConsentText}	consent.screen.text
802b8283-0517-4e61-93df-33bb547efd6b	false	display.on.consent.screen
40b02902-2943-4d35-8d99-6835d035fbec	true	display.on.consent.screen
40b02902-2943-4d35-8d99-6835d035fbec	${profileScopeConsentText}	consent.screen.text
40b02902-2943-4d35-8d99-6835d035fbec	true	include.in.token.scope
83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	true	display.on.consent.screen
83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	${emailScopeConsentText}	consent.screen.text
83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	true	include.in.token.scope
f1176d92-c514-43e6-894f-709142e29dd5	true	display.on.consent.screen
f1176d92-c514-43e6-894f-709142e29dd5	${addressScopeConsentText}	consent.screen.text
f1176d92-c514-43e6-894f-709142e29dd5	true	include.in.token.scope
e810d4dd-4069-4853-8ac7-708ccc1ee092	true	display.on.consent.screen
e810d4dd-4069-4853-8ac7-708ccc1ee092	${phoneScopeConsentText}	consent.screen.text
e810d4dd-4069-4853-8ac7-708ccc1ee092	true	include.in.token.scope
6968fef2-dcf0-4af4-b3c9-936368437b29	true	display.on.consent.screen
6968fef2-dcf0-4af4-b3c9-936368437b29	${rolesScopeConsentText}	consent.screen.text
6968fef2-dcf0-4af4-b3c9-936368437b29	false	include.in.token.scope
cc438969-bd98-4481-94da-976d776ebc57	false	display.on.consent.screen
cc438969-bd98-4481-94da-976d776ebc57		consent.screen.text
cc438969-bd98-4481-94da-976d776ebc57	false	include.in.token.scope
39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	false	display.on.consent.screen
39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	true	include.in.token.scope
ff161937-a987-4f12-af5b-3da8534c0835	false	display.on.consent.screen
ff161937-a987-4f12-af5b-3da8534c0835	false	include.in.token.scope
9be2e5c8-7d15-46be-a7b3-04811cb8ec97	false	display.on.consent.screen
9be2e5c8-7d15-46be-a7b3-04811cb8ec97	false	include.in.token.scope
cd17b920-5ad4-43bf-8a05-2969f69e80a4	true	display.on.consent.screen
cd17b920-5ad4-43bf-8a05-2969f69e80a4	${organizationScopeConsentText}	consent.screen.text
cd17b920-5ad4-43bf-8a05-2969f69e80a4	true	include.in.token.scope
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	2d9c822f-439e-43e3-acf4-feb12d41f606	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	865ea21d-5993-4a7f-ad32-27db092d5270	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	2d9c822f-439e-43e3-acf4-feb12d41f606	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	865ea21d-5993-4a7f-ad32-27db092d5270	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
d1cc947f-0a2f-4975-81a4-877433a52648	2d9c822f-439e-43e3-acf4-feb12d41f606	t
d1cc947f-0a2f-4975-81a4-877433a52648	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
d1cc947f-0a2f-4975-81a4-877433a52648	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
d1cc947f-0a2f-4975-81a4-877433a52648	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
d1cc947f-0a2f-4975-81a4-877433a52648	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
d1cc947f-0a2f-4975-81a4-877433a52648	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
d1cc947f-0a2f-4975-81a4-877433a52648	865ea21d-5993-4a7f-ad32-27db092d5270	f
d1cc947f-0a2f-4975-81a4-877433a52648	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
d1cc947f-0a2f-4975-81a4-877433a52648	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
cf8c636a-969c-4676-a664-99f5bcef27c3	2d9c822f-439e-43e3-acf4-feb12d41f606	t
cf8c636a-969c-4676-a664-99f5bcef27c3	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
cf8c636a-969c-4676-a664-99f5bcef27c3	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
cf8c636a-969c-4676-a664-99f5bcef27c3	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
cf8c636a-969c-4676-a664-99f5bcef27c3	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
cf8c636a-969c-4676-a664-99f5bcef27c3	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
cf8c636a-969c-4676-a664-99f5bcef27c3	865ea21d-5993-4a7f-ad32-27db092d5270	f
cf8c636a-969c-4676-a664-99f5bcef27c3	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
cf8c636a-969c-4676-a664-99f5bcef27c3	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	2d9c822f-439e-43e3-acf4-feb12d41f606	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	865ea21d-5993-4a7f-ad32-27db092d5270	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	2d9c822f-439e-43e3-acf4-feb12d41f606	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	865ea21d-5993-4a7f-ad32-27db092d5270	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	9199e97e-bceb-40ea-92c5-3d174a10455e	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	9199e97e-bceb-40ea-92c5-3d174a10455e	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	9199e97e-bceb-40ea-92c5-3d174a10455e	t
d1cc947f-0a2f-4975-81a4-877433a52648	9199e97e-bceb-40ea-92c5-3d174a10455e	t
d297f344-051c-4d34-8665-18b02a58d96c	40b02902-2943-4d35-8d99-6835d035fbec	t
d297f344-051c-4d34-8665-18b02a58d96c	ff161937-a987-4f12-af5b-3da8534c0835	t
d297f344-051c-4d34-8665-18b02a58d96c	cc438969-bd98-4481-94da-976d776ebc57	t
d297f344-051c-4d34-8665-18b02a58d96c	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
d297f344-051c-4d34-8665-18b02a58d96c	6968fef2-dcf0-4af4-b3c9-936368437b29	t
d297f344-051c-4d34-8665-18b02a58d96c	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
d297f344-051c-4d34-8665-18b02a58d96c	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
d297f344-051c-4d34-8665-18b02a58d96c	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
d297f344-051c-4d34-8665-18b02a58d96c	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
d297f344-051c-4d34-8665-18b02a58d96c	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
d297f344-051c-4d34-8665-18b02a58d96c	f1176d92-c514-43e6-894f-709142e29dd5	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	40b02902-2943-4d35-8d99-6835d035fbec	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	ff161937-a987-4f12-af5b-3da8534c0835	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	cc438969-bd98-4481-94da-976d776ebc57	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	6968fef2-dcf0-4af4-b3c9-936368437b29	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
4f9520df-706f-40c5-a2d3-761c3be7b1bf	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	f1176d92-c514-43e6-894f-709142e29dd5	f
4532d7c3-8898-404e-99af-10ae9f158c85	40b02902-2943-4d35-8d99-6835d035fbec	t
4532d7c3-8898-404e-99af-10ae9f158c85	ff161937-a987-4f12-af5b-3da8534c0835	t
4532d7c3-8898-404e-99af-10ae9f158c85	cc438969-bd98-4481-94da-976d776ebc57	t
4532d7c3-8898-404e-99af-10ae9f158c85	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
4532d7c3-8898-404e-99af-10ae9f158c85	6968fef2-dcf0-4af4-b3c9-936368437b29	t
4532d7c3-8898-404e-99af-10ae9f158c85	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
4532d7c3-8898-404e-99af-10ae9f158c85	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
4532d7c3-8898-404e-99af-10ae9f158c85	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
4532d7c3-8898-404e-99af-10ae9f158c85	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
4532d7c3-8898-404e-99af-10ae9f158c85	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
4532d7c3-8898-404e-99af-10ae9f158c85	f1176d92-c514-43e6-894f-709142e29dd5	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	40b02902-2943-4d35-8d99-6835d035fbec	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	ff161937-a987-4f12-af5b-3da8534c0835	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	cc438969-bd98-4481-94da-976d776ebc57	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	6968fef2-dcf0-4af4-b3c9-936368437b29	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	f1176d92-c514-43e6-894f-709142e29dd5	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	40b02902-2943-4d35-8d99-6835d035fbec	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	ff161937-a987-4f12-af5b-3da8534c0835	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	cc438969-bd98-4481-94da-976d776ebc57	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	6968fef2-dcf0-4af4-b3c9-936368437b29	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	f1176d92-c514-43e6-894f-709142e29dd5	f
947eed23-7adc-4635-b18e-9c151c1aa27c	40b02902-2943-4d35-8d99-6835d035fbec	t
947eed23-7adc-4635-b18e-9c151c1aa27c	ff161937-a987-4f12-af5b-3da8534c0835	t
947eed23-7adc-4635-b18e-9c151c1aa27c	cc438969-bd98-4481-94da-976d776ebc57	t
947eed23-7adc-4635-b18e-9c151c1aa27c	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
947eed23-7adc-4635-b18e-9c151c1aa27c	6968fef2-dcf0-4af4-b3c9-936368437b29	t
947eed23-7adc-4635-b18e-9c151c1aa27c	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
947eed23-7adc-4635-b18e-9c151c1aa27c	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
947eed23-7adc-4635-b18e-9c151c1aa27c	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
947eed23-7adc-4635-b18e-9c151c1aa27c	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
947eed23-7adc-4635-b18e-9c151c1aa27c	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
947eed23-7adc-4635-b18e-9c151c1aa27c	f1176d92-c514-43e6-894f-709142e29dd5	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	40b02902-2943-4d35-8d99-6835d035fbec	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	ff161937-a987-4f12-af5b-3da8534c0835	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	cc438969-bd98-4481-94da-976d776ebc57	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	6968fef2-dcf0-4af4-b3c9-936368437b29	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
71d0319e-df6f-4a71-8f4a-353fc8b57122	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
71d0319e-df6f-4a71-8f4a-353fc8b57122	f1176d92-c514-43e6-894f-709142e29dd5	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	55cab3c6-7f3a-40f6-a08e-26b93a97e44c
e0a36a51-2daf-4275-a163-5d03949f8dfe	3d3e7c9e-938d-4971-a2db-e9606ac6f353
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
c6750b2e-2953-4c9d-8df2-fef810568478	Trusted Hosts	767d9b8d-d1e0-46e8-8336-872e7ee443dd	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
2932cdb7-bb3d-4ea8-855f-0005e4f2a005	Consent Required	767d9b8d-d1e0-46e8-8336-872e7ee443dd	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
355a7915-968a-4b22-81fb-5b220eaf4d2c	Full Scope Disabled	767d9b8d-d1e0-46e8-8336-872e7ee443dd	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
47b38b4f-8c74-4bcc-bfb9-a3314fab53ce	Max Clients Limit	767d9b8d-d1e0-46e8-8336-872e7ee443dd	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	Allowed Protocol Mapper Types	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
0d9eedf9-0729-47a6-afd2-c87ecc044c13	Allowed Client Scopes	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
de957ca1-7466-40d6-be17-9547a322f7e5	Allowed Protocol Mapper Types	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	authenticated
a739f054-6916-4a0f-ba16-0721530d5bc5	Allowed Client Scopes	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	authenticated
c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	rsa-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	rsa-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	rsa-enc-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	rsa-enc-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
50642073-02d2-43ea-a018-5313e073db8b	hmac-generated-hs512	767d9b8d-d1e0-46e8-8336-872e7ee443dd	hmac-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
b06fa115-261e-4ae8-86ee-332cd7c6b11c	aes-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	aes-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
f8d9e231-643b-4009-ac4b-567173041645	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
e05c16fd-bd6d-41c8-9314-e67cda669c4a	rsa-generated	3dae0dec-5d92-4955-af55-89d9c775206b	rsa-generated	org.keycloak.keys.KeyProvider	3dae0dec-5d92-4955-af55-89d9c775206b	\N
a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	rsa-enc-generated	3dae0dec-5d92-4955-af55-89d9c775206b	rsa-enc-generated	org.keycloak.keys.KeyProvider	3dae0dec-5d92-4955-af55-89d9c775206b	\N
5bec68de-d0b2-41a0-a6bb-c89e7d199f92	hmac-generated-hs512	3dae0dec-5d92-4955-af55-89d9c775206b	hmac-generated	org.keycloak.keys.KeyProvider	3dae0dec-5d92-4955-af55-89d9c775206b	\N
71aba759-fa50-4c23-9f84-0c3a5b0416e2	aes-generated	3dae0dec-5d92-4955-af55-89d9c775206b	aes-generated	org.keycloak.keys.KeyProvider	3dae0dec-5d92-4955-af55-89d9c775206b	\N
47c543ac-b097-485d-aab1-a5a52b311b30	Trusted Hosts	3dae0dec-5d92-4955-af55-89d9c775206b	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
ce3c68d4-c0b3-4bdc-bd2b-bf610b4417d6	Consent Required	3dae0dec-5d92-4955-af55-89d9c775206b	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
dbc55618-dfe2-4b36-ba36-eb4c7df9d008	Full Scope Disabled	3dae0dec-5d92-4955-af55-89d9c775206b	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
faac03cf-06f5-401c-a54f-5f3b64713d17	Max Clients Limit	3dae0dec-5d92-4955-af55-89d9c775206b	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
9b5b82df-2e1c-494b-a979-0f023d57b640	Allowed Protocol Mapper Types	3dae0dec-5d92-4955-af55-89d9c775206b	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
1da9ce23-a215-442a-9d06-d07eb9b0c921	Allowed Client Scopes	3dae0dec-5d92-4955-af55-89d9c775206b	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	anonymous
98899e9d-d1fc-485f-bb8e-ba3be6b86efa	Allowed Protocol Mapper Types	3dae0dec-5d92-4955-af55-89d9c775206b	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	authenticated
a4193e6e-d2c5-4323-8cae-78f8161bc16a	Allowed Client Scopes	3dae0dec-5d92-4955-af55-89d9c775206b	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	authenticated
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
042bc7f2-02e8-4484-a415-948d4a72d9a2	47b38b4f-8c74-4bcc-bfb9-a3314fab53ce	max-clients	200
9b93a031-bb2b-4016-a6e6-8ef4e407f361	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-user-property-mapper
d0366776-fad3-49b1-b04d-850e8b1955a1	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-user-attribute-mapper
aad70621-92ed-473f-9653-640a07c03e02	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-role-list-mapper
d51df27f-1603-4ed7-95ab-2a09a1ce3c13	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-full-name-mapper
2bcfce92-6445-4943-ba0c-9a2e45ceebe1	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
f50a96d4-3beb-4566-adf8-75de7bb442a2	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
51db98e3-d187-4250-8d6e-6af239b681d7	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
a7f70a9a-1dfa-4491-b157-e50e595ccb1c	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-address-mapper
6b745bc3-9790-4990-a7ee-b50f6730fa81	c6750b2e-2953-4c9d-8df2-fef810568478	client-uris-must-match	true
adfbc05e-11e7-49ac-8db9-259bb28a0419	c6750b2e-2953-4c9d-8df2-fef810568478	host-sending-registration-request-must-match	true
92cdca24-089e-4bc3-b731-0c44f86c7d4c	0d9eedf9-0729-47a6-afd2-c87ecc044c13	allow-default-scopes	true
cda462eb-5d8f-4436-a3c9-929edfef2089	a739f054-6916-4a0f-ba16-0721530d5bc5	allow-default-scopes	true
aa35b148-a84d-4f0a-b19f-88aa436ae637	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-full-name-mapper
abb580c3-0db6-4838-8eec-bf0123555e12	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-role-list-mapper
14390cd3-92f7-45c9-a224-593517bb44d2	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
8ae8e370-4de1-4a05-99ff-97b6bc835251	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
a597645c-2780-402a-8a9f-7e2e9c78058c	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-user-attribute-mapper
c9a0a75c-f3a0-4038-a0b2-075a8d152ebc	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
af2da44e-6c6f-4cb1-84ac-8d9ad8b468a7	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-user-property-mapper
69febcd4-35ca-42b9-b9d6-1ca1efd2b9e8	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-address-mapper
072d44b0-cf14-4865-8b7a-87bbfef41f26	50642073-02d2-43ea-a018-5313e073db8b	secret	6TJS-bbq1MSrOoGXZPjTAFBgas7XfD3qFGyB3oD-8g51_lr7b4ilfbYsZuLOK_qOPKfizPaBUTA5K6LDOXXM2KYbJC0LgXV69oWLtN03h-al2KWHoxM4KueHUCMVnIiacTQXLbPHhtVVd1DdyBXmY8FTZ70k46npgH6-s_L24Gk
a3cd470d-4f5c-4c62-bca3-526bfe586928	50642073-02d2-43ea-a018-5313e073db8b	algorithm	HS512
e95f443c-37b6-40b7-bf39-5b2ddd1ea2d5	50642073-02d2-43ea-a018-5313e073db8b	kid	7462f5b0-fa48-4bd1-a389-1bee8d6270cd
16d917b5-3dc7-459b-9834-b6923f28ccfd	50642073-02d2-43ea-a018-5313e073db8b	priority	100
a152ba5f-9c59-4c95-8640-9f0e75dd93c5	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	keyUse	ENC
79b130e7-b02f-4849-989f-bcf3bb311c7e	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	algorithm	RSA-OAEP
a0ba20aa-5131-44e3-a949-cf4fee62f5c1	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	privateKey	MIIEogIBAAKCAQEApUEy/I9aufzWS4S4zAERNoOO7KS9JkoP40Rmx1ySw9hPraW/WdePm3XfbOggx/RQzobmA7jxS7biCje81RzZO8ERvjbFTZHKuP+8V5T17+ejZ4648hzjGeIaUfSBQ8qWnu5pMjmOH13d5y+L2HELm4eXiOKfaolowiH2AXOHn5ymbxhevVJrTXJPaosyS1qMwqTG8EfWnukDP1yc6xyvUR/oabhx/GsPrkc6vZ6T30p8/wfvtI7ShNlLDgbg1CETy4jAIIuq5gV7cTCDfz8UbEC/2txTKtarnaGFHXFeKXrfeXP4eD2ALFtTtdzjFEgktUpjQLU1mfeoyoJ2SVZSPQIDAQABAoIBAAe7XjcCP2d2VKch5ZeTRoqQwI4tQwsDP20Nv+qnV9fr9gZqO+K95Y02MvxLJsV+6+JN3iiMbasc5Rnp87Qw7lplCn8mMY295YifBovpKfyjOjpX1irAfpZbxYl8xtOKK16c9F+84PvHY4uJO6Imio7TWvFfpmp7VWMdPapht8BtpjQgRPbF3hKaKc/3BCD6UfQBVfxHJ0VvCuCUcmX5/JcUjVu/Ec3U7Hb0AXNgnLy7T4JxGmBdBQwdpVCfR4GIEOYkWVvnK3nFCRbygXOXiQEzbGAGU/8N6P7Y84jw73pBZKq+C8ouD8nGyvo77yin/wjRy1lDON/Z9PStHPlk3EECgYEA5iU6cdwNsOdeUisc2vQNDxsyI9nydCv/pWmtSdtpLax7Wh14lSf9DQEQA1yXL7wFuaNV96RAZUBASyLlMH+WRK8JUtZZqFWmYbCIvmyFQaMoMTj6hbm3bZ59TnVuJTjZoQwBql91FXgKEvjLutE8Q8S2rDY8DCVq4dk4fyxnFQ0CgYEAt9HFyjqrbjD13xIAGixTLHosbMwLyU/ZOj62c1Xo5BjRRLh4Dy5QCqViX5aC2/8yta/a3XnNIFZEVdw4oxlw63rKN7KfJunwRNx9jC6q229BchkSMhFesDpBQ1PYjaLGWLb3lwSegkLkoOnoNzZmJ4B+4oFW5JJz1JwDyBhbRfECgYBYvYYZnRYSXkQ6PrFzo6LdbkkZFdKtBMIgT+0ni1i06cruZmq2aKLkPsKj6THKkB9NAzQEtuq1n96qmhvxZWDVvwBDVq9ffxcWl/FCK6n+MyEuSaAfrAqUVAZRGGqOI6uWs4B45zHIQ27u/cvgjwlDwDgHkyn4LP1XdGCaeM6OiQKBgB2lnaryL3gEOYOS2aVfBMMlqUia2EPNtxFnz/FmJ7uyLP5Sajq4k3xEFEuqcMyeqkUXactSu7y9bSQT8qaLkeTI1xiInJagIHpavX0AgdoGZZ3LYV3l40m0+5WqTkD5wdfJGsGmoxILS+iQET3mbi9s0AokJimTXU8rIokBNKdhAoGAUUwsMSXevoQ4aq1Hz/CQkOc3wD45N97pWD6IcTLR6x7sJxPbrlQgXFweE1NHgRfGCksx1Ba2OKHjpfsefUyziBTDqCZ1ThV7W9slGwVpNRpz4uZl7yw5qLfZO5abS3PCtoeTkQCbr9bJcjUShRKmhSO/HjgV60qKbcZsTTrcoqY=
65b6ede0-cebc-46ef-93f0-44b544c30c1d	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	certificate	MIICmzCCAYMCBgGVPMgczjANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUwMjI1MTEwMzIyWhcNMzUwMjI1MTEwNTAyWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClQTL8j1q5/NZLhLjMARE2g47spL0mSg/jRGbHXJLD2E+tpb9Z14+bdd9s6CDH9FDOhuYDuPFLtuIKN7zVHNk7wRG+NsVNkcq4/7xXlPXv56NnjrjyHOMZ4hpR9IFDypae7mkyOY4fXd3nL4vYcQubh5eI4p9qiWjCIfYBc4efnKZvGF69UmtNck9qizJLWozCpMbwR9ae6QM/XJzrHK9RH+hpuHH8aw+uRzq9npPfSnz/B++0jtKE2UsOBuDUIRPLiMAgi6rmBXtxMIN/PxRsQL/a3FMq1qudoYUdcV4pet95c/h4PYAsW1O13OMUSCS1SmNAtTWZ96jKgnZJVlI9AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAJE2hJYSAC5coW2ZFzLeXDl88Z6FN0u+LKTpYp91lm8NBl8fcZQJuS/W8jvQ+Br4Cg5vxQqNH4mFaaETkhzrx/J7QvfUCu+IeuIeW+XehdpqtJx7FxU+nePTve6BFzliK9W7zWK92paxv1TUkwr02sQ24LdhaqQeLntHuAo6SWHTEoIO+ps/litab3AeSWkZ6I7dWn9D0Gt4TZBidj5cChyEHMnVMHW47vFZTZUK88N9M/uBYFTI+bvYfuGodIqpccYz/8HBOAkjE9M3Hc2Wd9rOiS7NW+whf6rVmkHoU3dlzh3W/l1Ug7wXAsfR8eeRCGcveE46omGXwS2cv39OAFk=
b7181471-14c1-4fa3-9e2c-6e640bb1b1b4	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	priority	100
ded4a11b-7abd-4fdb-b233-be48d995fa65	f8d9e231-643b-4009-ac4b-567173041645	kc.user.profile.config	{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}
6ec8f46d-4e8e-471d-8787-1ddf1af7f614	b06fa115-261e-4ae8-86ee-332cd7c6b11c	kid	63abe760-8121-485d-b884-bdf55b8e9eb5
21854026-ddc2-48e7-bf16-daf569f0247f	b06fa115-261e-4ae8-86ee-332cd7c6b11c	secret	9ShRH1Jp6dBjolpW3I86IA
a0609ecb-3c5a-454f-96a3-b47b5df1c543	b06fa115-261e-4ae8-86ee-332cd7c6b11c	priority	100
05e180e7-4980-498a-8077-546d855b668e	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	keyUse	SIG
105064ca-70ed-43ff-8257-ced4194ad373	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	privateKey	MIIEowIBAAKCAQEA+kxhRhvrdAYVJZgZaArn+8j406F4RjdVw/Han2QgxT7jpweu1xiI8dEFvM1tkazMGVrRC2yuyotcgrUXaiUdrCqlEbjYUNfHdjVYmwtq4qDZalCAtqN4Xz1elqJR0t9wL6LNYnQXUtcLX7q4SXEHGzrJO3/X+5bSlo0gmO7NjPv/tPimf0PKFuVFym7hlcuFdtIA1lQd68RpdUdVvkIFUjhRrv4vvpRJC3PoGe30r7pNHjqYgC7NKtwe+JHPgyenucfMq3/4TQA84do9iJjZTAEXGR73F2/e0DjwmCGXcQjCcGlVvhCWCC5QPu9UH4Lh08Ik/ptJyqPoCLCSeV0eXwIDAQABAoIBAHGaExhP+biqPhTXCMj5EjtsBst+4Oj1mn6ZmcF4H4uGtKqNySQlJZqjZPhBQLa6d9QWLQUDaf3R7MYCTUNG30XSASOfAscGeKhFJBcSwotjt+oR6al7XlnTr8esmnicIv3r5U4HJMLbiXUEeToUC8anEshniO7OkHv2R9JBqJeQrsF50PKdFpwd2rQ87ZCDK/8blJ8sz3hsO0Z3UsrCtaIzCjJD3BrUNbF4mNeBGzIxpO1tG2hmFiJBh34YgSkIVA+eBHob20k+7uPGRJ+5wifa/k5ObPbQrxelAs7ChZKOWld5oZ8uPjnecDw7A4sYvnVw1s+B7nfVCYszh+yxCLkCgYEA/SS6hBEDTB45eO4cyQwIxVSik3zHgdwr+sf6zBnjtDV5nq6GY26qC/bu6AQjbiQLp/Cifeq+OQxfAd2pD1GgRJ5CRJGiIepY6ehz9E5JVGGAuAAZc7MeljVEIuCEMiHUA7G/dFram/AQZlPI66/0VqYgJj5fkzWisWTn9cf2kpsCgYEA/R9uu1AIw10dCY+3rhA/fRP2XlMxppN3dHImaKB5VnvH08o4hR85sqOQw0DrLmDQjcJdmS5Lm/B/oQLqELp2ZaoCjHakQbLj2AHZimwG6nehHiaNoZKfmnwO3mYKKWPuXLN+G2NmvxQb7vBhcRn/SuCpk0UlPevOMOFGv2jdjY0CgYAKkHDUOB2KHKzLViyPW1g2W/zY6NkumzCeq5/UyrPM/npP2/qxxZmFHE4GEr4jx49Q9+LgHF7J5LFGU6jNgduNYYlkcStx/OSvBktog6fdxJ/pjd+CC5SYMirgxbvel7jQWqehxHThExisHI0DAPnSb+ZhkjLM4u0iOBLSGAE7RwKBgQDYhhPV3W+xlqwpKqxIFJQKrZHZPDdDs+/CR4c9htBkv3u/WsOgdIaJnktOCvFi+eRM70/bofOBkGfM1s5cwvRWoOiPOUnm/VzTwTlSpHgCB5VmUjpjVSZ8ItUhP44/u8EBwXUFfrE8kLoYWb4w3rk4VxgX51UlM9psi7hWMiEbXQKBgEICw8mMQs40xtgADCVN1RhI4rX14vQTB1he7GMcW59ptox6MoWuIAHFFryFqNZoSOVsOZ28sICeDwyPZ571SzhgWnHSwuJezruENe6BtlhGqy3YubEDjOb/HpxMuE254T0rvvevuWC+qlsz+Q+03sid8Mj/UV7H53WGN1PB+Xbd
09b742f8-f85a-4469-bc5c-d2876de0d4da	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	priority	100
011da049-f098-47cd-8ef8-52bda97c3a32	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	certificate	MIICmzCCAYMCBgGVPMgbojANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUwMjI1MTEwMzIyWhcNMzUwMjI1MTEwNTAyWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQD6TGFGG+t0BhUlmBloCuf7yPjToXhGN1XD8dqfZCDFPuOnB67XGIjx0QW8zW2RrMwZWtELbK7Ki1yCtRdqJR2sKqURuNhQ18d2NVibC2rioNlqUIC2o3hfPV6WolHS33Avos1idBdS1wtfurhJcQcbOsk7f9f7ltKWjSCY7s2M+/+0+KZ/Q8oW5UXKbuGVy4V20gDWVB3rxGl1R1W+QgVSOFGu/i++lEkLc+gZ7fSvuk0eOpiALs0q3B74kc+DJ6e5x8yrf/hNADzh2j2ImNlMARcZHvcXb97QOPCYIZdxCMJwaVW+EJYILlA+71QfguHTwiT+m0nKo+gIsJJ5XR5fAgMBAAEwDQYJKoZIhvcNAQELBQADggEBALsAXUqn1g/juR/EPGeciW3Bz2xTyA01CRZs1RPZ8AMiifYHyRxUWqvpgxrg0mkIGyXDvZmRogzSw8CrVKuVEuI4/uv0DAXmj+VkwDVEskE0VIQXL2+OvK0lSg7plzdy2h4BaT6dpBBeyAgrbE/iZjqyKbSmUbq8vtIs+gIH0Eviv6NMCTNeC9eTEnAFec+HAzJ75v3jONtI+25WNoI0LuRtcGZM+PS9joQk6CUHdpuauE/ex4+iMsEGpS8S+eXRrxuXI/MhpYToavxhX3WFOz7KsFBkPeIq7yNYP986yiXjPGiS/PtSCLLgFiJP3CGUqj377Y8QBFCpNE11MfCgCRc=
4c233a26-d006-4719-89db-35dc027e34ec	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	saml-role-list-mapper
99002a4a-0017-4c48-92b8-dd8b66ea05f4	faac03cf-06f5-401c-a54f-5f3b64713d17	max-clients	200
892ac00f-87d4-4a0a-b568-7518ec5eaa35	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	saml-role-list-mapper
b2fe3214-12f9-4811-b1bf-3587afb11973	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	saml-user-attribute-mapper
bbc4fb9d-025e-4375-99fb-454d58179d66	e05c16fd-bd6d-41c8-9314-e67cda669c4a	priority	100
03371ccb-f840-4603-bdba-a55de4c8e1e2	e05c16fd-bd6d-41c8-9314-e67cda669c4a	keyUse	SIG
2d6a0e3b-e347-4e73-8750-0fc05c4704d6	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
44391f93-c574-4a51-a712-cf29f5c9776b	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	saml-user-property-mapper
b9c74543-b17e-4ff1-8984-2f495ff42ef3	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
bcdda4bb-ab6d-4bd4-9fae-baa39d7e9201	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	oidc-full-name-mapper
a5f21c5c-0bb0-4799-8d09-e7bf8c245b3a	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	oidc-address-mapper
0f0ff139-3ba6-4086-82a2-0b3083df43e8	9b5b82df-2e1c-494b-a979-0f023d57b640	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
f5fa16bd-e29f-40e5-baec-178b204a113a	1da9ce23-a215-442a-9d06-d07eb9b0c921	allow-default-scopes	true
15cad220-c0b8-40b8-8cd3-41f0e4fa77ee	47c543ac-b097-485d-aab1-a5a52b311b30	host-sending-registration-request-must-match	true
5be7dfc7-f2e8-4704-982d-258fbde45b62	47c543ac-b097-485d-aab1-a5a52b311b30	client-uris-must-match	true
bce2ed16-b1e0-43b7-91e7-ab9c08d87f04	a4193e6e-d2c5-4323-8cae-78f8161bc16a	allow-default-scopes	true
db0fca66-accd-49b8-b378-669ce84e8fce	e05c16fd-bd6d-41c8-9314-e67cda669c4a	privateKey	MIIEpAIBAAKCAQEAucWwLZqJMK+qkWj5s0yjgH9oeN50LQvibbmlU896vWFQ/BqKXdXSvknDf8votvY/xs0JhxiGPavpzGUx1fA8YQ/CES4HKhU/uT58LDMJg1UhGFxtrPwFisTZv+Zr+UFYhO9lpje6YfOiBkK8HRdCzQjMFLFzr8w5vtY5D8SsTAbEgYOwsmTleRSVCes92aSLzdDjLKjrYZ9BflNLo4t/flvlEQ16/LqBK49Qx9k31PkkO1k2vZUZEb9J0sDhMcGJ2jpppvdWbEk5xnLo38rnnFvvoGMXX1p/4amL4BxXNg32OJbokL/jXSXSxESW3fKPFValWuF0oMuPNsSpKFI0dQIDAQABAoIBAFmoUMJ5sluGdIYwSU7hHon+M6AeEKjK8xFsxx9fY8fxp0G812m5MDg5ZnqPoXVn/FjIjSAf1G4AQdqtPjOX+bQIhGuBMOD9F1+iihBU43L4i3vz49TYXx5dqg/lN9g40u15kq/5dmEe0eQ+ogZSOyG0bLZR/FjscjQptKlpDJS13F7aMO5nmfIVcvtMZNGWCWy7GNhXWlRFBLUQLjmwW74HoLnv3ZOahYDFcLl5GwqvG05TnBj/sV61fF4g4W32Ht2ukWdYGKp59Wv1277Lyy2l+VmCD/TaOQ0BAc5DoLYPs4ig2AfKZBvWQn2wbw1+w3A8skvEMk9Q9AvQJJj+5hMCgYEA/vR50Mp2krAwZw1uyHHtXHlmz0+FuYPOm7ssKrdNGa820zDTKUby2C3TGTwACyHlD0z3HVIJuIiIJFeEPg7BRxRbXaYtJYeBXnkb+g3tc1JyAqClrp6yYyDr/Wjr1UDftPzFcGFOMi9U8uRRkXMQBNFeBBlsKgMr6+H7UHq2zu8CgYEAuoiecMMrRz/sHW/KSGFHN2arZ8WVS2OUvPEpljW3v0tLlvsARV8YclYEkAkXfv1vJOihFtZa0vD+f3dh2w+9232eh/7RqVHD+f5+EHbOc+imgl1P3XsRzxFQGDwJgiBM9ip3YInY8cLJJ42YrmcR+lXGulWYauSxPB9B2a7DstsCgYEAkUn6fUxTY+Z5vtA92IZr8G3Sc8Nqfjypqb9xPOp2SnO594H0Y6ply2HZ0aCKmc13/k8q54+PsJRFmQgyeTbpV7s3EdgYFDHzPEYh9k6niTdrdynbIPaYy7rAIQoAkudEVJxTW2ZoLFsiusP3475BW62AOS/PnuVtyx9dmxBDSwsCgYAwe5YC5Rd4m2q5c/b1vSMPiUX/4OEfCTD9swkGG8w4kk+BXJgDb+Ygwa7J6TMMNL8Qrs4/61MMBMuBQfxTPdIxHIN6AYdpJPF1JuqJSPf8NHoi5DH/9R753RweUGyAP/kA+qSwmOOkYuZ5u1n16qBHmsfeYqUNE4flgpJRDBWdhQKBgQCxfwcQV+vC/si8DjEe8kBhDYPayci+4uhlMvh+GQfydr/QGK2Z1iUpMUm6WxkbhCSSaEXjod/05ekkU5KHDVLYGj6InM4M1AOYM4qbBuBS78JZbJGlBYUqAQ7fVjDXzCLlRsDqbn3BAcp2OLLHrBr/kCsQJhAAad+IT6B/kygyVw==
515ee33d-286d-4e97-8800-4569a94ceb84	e05c16fd-bd6d-41c8-9314-e67cda669c4a	certificate	MIICqTCCAZECBgGVPXz4sDANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1tZWFzdXJlc3RyZWFtMB4XDTI1MDIyNTE0MjA1NVoXDTM1MDIyNTE0MjIzNVowGDEWMBQGA1UEAwwNbWVhc3VyZXN0cmVhbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALnFsC2aiTCvqpFo+bNMo4B/aHjedC0L4m25pVPPer1hUPwail3V0r5Jw3/L6Lb2P8bNCYcYhj2r6cxlMdXwPGEPwhEuByoVP7k+fCwzCYNVIRhcbaz8BYrE2b/ma/lBWITvZaY3umHzogZCvB0XQs0IzBSxc6/MOb7WOQ/ErEwGxIGDsLJk5XkUlQnrPdmki83Q4yyo62GfQX5TS6OLf35b5RENevy6gSuPUMfZN9T5JDtZNr2VGRG/SdLA4THBido6aab3VmxJOcZy6N/K55xb76BjF19af+Gpi+AcVzYN9jiW6JC/410l0sRElt3yjxVWpVrhdKDLjzbEqShSNHUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAqZetEU41Bo+kolalLQpmwUreKmYSLsLxFsrqbR8Yzhl6RQTH9kHT/pzbGdoOJEuzWohOExxaqIGdgo5PKpIhsUCQtcN1CTX/+vFnsioYk6lcUsdFWXVXwqitEiJAp//n++P4DYFa98Mk0AjrpdKH2X+zqKU0ggCTtHnpOilY2W1FR8Sw9itf4dvcCJiKloGLbm7x9nQzHbREnGsY31Ipdrhr1UA6CgL7qkE553+EfSA9Cxv8E67eQ21Pp31Ua2uSV2wWWvwOItAKNB35Bw3cBfSjZxqwXlLNtenxxc349OIYYWjhwD2S/ZJXq162rj/cZ2k6ky7AYSF6BafbU+XViw==
4db64800-ed83-4d24-88aa-84f7e258e655	a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	algorithm	RSA-OAEP
fc68d275-5835-4ee1-bf86-91ffa45a3454	a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	privateKey	MIIEowIBAAKCAQEAsarfB0R8uj7zeJxh52I2QxukGu/Y4Px9dJbSKa3EYWw2+TgMno7wJUfx7UdyOSYwFBbnjnI3RWkprsfRRqnlq6Vr0R7rZ8D3UZtkJy6k9LGd0Y/Q0EolsMbnjmlfRmI9lQyUZx8hbhoe92hA4spXX1oK6p+vnFVym/I9NE0BmlglIKYFKI7gM2geJZzd3M6n+m4/rQf2S8R8nhlObLF8ctEdxdePa8IoLPOWlOSNcBvK0j5Pp2J64zznaKXB4df5TlKYV0x2xsojz1HJIx0y3fsYeIoWD98aUeav8AQUwJUnYpCRXtu1YoL0QRHmLO9xnhUc72zry14xgdr/3qwzVwIDAQABAoIBAAOMcyn0/zzFFx3YmcgCWS0b9zomgkF0KZlTjd0RQHPlsm9l5DKijj9gYX+oxqpHjfxIvNVGiL4VLKT2DsMHj7PO+QlTQcZvv0DdBrIVp2vPxGQ0KCqQ4JHYVzWr+yAvxCUe/DPXFlbZpLayWWFuQzJ/XOp0yBAqUMC2pOxPgXGwunFToTxAT4aSnG/7547YZOAyGwJou9qeFdeS9POIxkeFl5BBW4lZuOGFYy567+fnzhfimQ7Z+aDRaOwn9o/ymge9TJNn1oyOcgP5b0qEVNsAiZjZXGh0M15h6HnrtX94qbeg32bihsAMZmdlAmrI74Htx0GYflvlmAkoqUoAnwECgYEA75nBsJoeKCqGRTeAvRTcL5R0XF285awJNgua8Iuj28Z7n4O9UvrCrJhAhKLLxP3xWNrQg2iwD2Jm++Nuqixgc3eQBaugjtGkjz5qVTfPltEbZmZZZLiXmHJyTzttRSeNZ/meBDbbE/5wXmwYYus+aPMa6vRlxPaZYZCTj1Y3x9cCgYEAvdPuleZW8ohd1hNljllDr6EKqrCKks3l0eJTPR9+T9hctmqZybMMvHZVc11w6L7iq+pi22lTFX5JKTWkFGbQ5vhVYjopFEZPH+y7yfqhoagUL78U3yPr0fEyf6OJ0kzsIrO8LV/zAxAk4VyeahGDNqc0olwUQ4Dg/Ma0SLPjgIECgYEAvF6hjHpeIy3rihdsuzrfMPkB0mxPyjFKvJa7JUpjdLHDF1G3Urmau56nep+SnDkZucWuEOIJKM8wL/BKXLeuzJi/PfYEsMPZIFTtvDm4ltWnOQZWWX1WkZ/IhsotyiSiY5A3zxBhhIKRTWqmcX6I/nHCQ94I9KT7SV0k5ZffGtkCgYBhOVCzWbwikBFveZPEKpfuNg8eiTkQI4CX1NFJNv4cqvYhP8vwcFIPnJP7eFpB+rJh1rQ3KGSzV3DlOGIHSPmpsnsYyi0MA063TSqJMmLiRxG/uqBYAS/g4SY6FWqbWWaAB4pTuxbd9MDO4/8G2F1Z+p2MopiGUlXpYWQo8GmPAQKBgBBU+0qH4Lp0AyquKfOktMxxj7FEcBOoafM6n1QIDfKmZuKrSyK3tj2QszrcFvddDKNwztQPM2aL9uXodV/QaUzbBxxfUYk5z7u8n2lZ9UMds+1zGoBsPSZr366xwOKIigzoJnTFa/iA+/79BxRm7zsDWRfEX276Or2H8UOv2126
4cba1d41-bf53-48f8-ac3b-930b8ab2565e	a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	keyUse	ENC
8640a773-765f-476d-a880-eebdd1871403	a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	priority	100
7a2981d1-2370-4063-a54e-322b99a86b97	a4aa1f1f-2cbc-48c6-932f-a9b8a5fdf528	certificate	MIICqTCCAZECBgGVPXz5wTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1tZWFzdXJlc3RyZWFtMB4XDTI1MDIyNTE0MjA1NVoXDTM1MDIyNTE0MjIzNVowGDEWMBQGA1UEAwwNbWVhc3VyZXN0cmVhbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALGq3wdEfLo+83icYediNkMbpBrv2OD8fXSW0imtxGFsNvk4DJ6O8CVH8e1HcjkmMBQW545yN0VpKa7H0Uap5aula9Ee62fA91GbZCcupPSxndGP0NBKJbDG545pX0ZiPZUMlGcfIW4aHvdoQOLKV19aCuqfr5xVcpvyPTRNAZpYJSCmBSiO4DNoHiWc3dzOp/puP60H9kvEfJ4ZTmyxfHLRHcXXj2vCKCzzlpTkjXAbytI+T6dieuM852ilweHX+U5SmFdMdsbKI89RySMdMt37GHiKFg/fGlHmr/AEFMCVJ2KQkV7btWKC9EER5izvcZ4VHO9s68teMYHa/96sM1cCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEARGeqPNvtfny5MwXtTZxj7wygC1V9OoA6kmx9t4+Wius87qx9eFbJcuiTeFIeawA/6XljZIVlFXP74KROox++Urnu0ZFuMFFl4byd8UZsC1IZhPmrRMQQJou6zYkePjpDmKG/Wr46HjaSyisqbpsXNOGCnFL32pUeMbhIBwUFwje5yymcxHhN29TOVMz0yORNsI0BZXGAc9a0TkKxdpjRADfzDFD4P/FKtgbVeR/o/aB4hfsll0/IpfAb86Jv5bGWiMGOhtvw1rIJqqYUqYUeukEzaQqMm3knokKWzGhyNdJWZ15HKO9Pz9MmEEuCcJb32UC5XfQCLzokULKzgGUKpQ==
5030cdec-3ac6-4c58-ba90-7df9b699bb04	5bec68de-d0b2-41a0-a6bb-c89e7d199f92	algorithm	HS512
ab6a8173-a9d1-4683-a537-c775a7ff8624	5bec68de-d0b2-41a0-a6bb-c89e7d199f92	priority	100
43f0e5f3-0cef-45b9-b9ca-562a269816b4	5bec68de-d0b2-41a0-a6bb-c89e7d199f92	secret	gD0U5FeVWivrNSYwU5dTfnnLmUz9OjhooRf2N8YlFNUW_cMB1Llu-fMu-3oq4lfjIiEWyBXBdSSEHC_UVTPMkhLA6DISTnsP6EAbdZbt9c6zlQRxbJdrbOyxgNZn2_vbRt9-ZI6n1Were0hVMfQjCIHF1uxInIXjhIpOIEo4N3Y
b3ff9a2d-9a84-4f55-a139-fbea56354222	5bec68de-d0b2-41a0-a6bb-c89e7d199f92	kid	c90b672d-5aba-49c1-a90f-4e51e9b1b44e
898292b0-2c4b-4fb2-980a-3328ba84495b	71aba759-fa50-4c23-9f84-0c3a5b0416e2	priority	100
e52fb79c-637f-4839-a4dd-93db665d87fa	71aba759-fa50-4c23-9f84-0c3a5b0416e2	kid	868bcde5-7214-4ba6-a700-16eebf90518f
12d51211-7f57-4383-87a3-8cc4561ab8c7	71aba759-fa50-4c23-9f84-0c3a5b0416e2	secret	XqhnbiPJeO2han5_nR0n0g
d16fae7f-e8f2-4fdf-b9d8-a07f7c7f0977	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	saml-user-attribute-mapper
4b891bc7-f10e-41be-ac07-592ea16193cf	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
83bdb889-e440-4097-822b-1ee806e745c9	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
cb254e1b-da06-4399-8491-62ec4c52d2f3	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	oidc-address-mapper
43db1d8f-c00b-4c4b-90e6-2d6de1df5ab2	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	saml-user-property-mapper
f6106a05-7296-41cf-9e8e-1ac75e078d3c	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
576c9529-5b5c-472e-87f4-c0be5b9e7788	98899e9d-d1fc-485f-bb8e-ba3be6b86efa	allowed-protocol-mapper-types	oidc-full-name-mapper
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.composite_role (composite, child_role) FROM stdin;
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	576695fb-214c-46fb-920a-5f37daccd8db
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	4a113f85-5fef-441b-b9fc-e9e274176d68
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	fead0a36-0ac3-45c9-8dd5-4c46fc821e5b
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	dc2de297-3b8e-4ffd-a880-8c9b1a6257a8
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	f365b4ce-2639-4f36-8360-4e4bf1893736
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	2d16f16e-a30d-48c1-b543-28e3cef5ea64
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	b997a6f3-72b8-4a3d-b638-c1c9f1340d07
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	3fdf4e0f-4d93-4962-bbf5-2ada51626463
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	8833c6b0-ad0b-4f81-be0a-f40c36cda8fd
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	ee457df1-997d-4007-a91f-68f606b76802
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	f80e1181-0306-4dfe-91a6-6c2ada6a7013
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	152d8406-23ba-48d9-b26b-c59d471bfd8a
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	381d870b-aeb0-444f-8294-5e24ad05c049
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1496f35b-23cb-4df8-a7a7-5dd0ab9deb54
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	bf942e68-e846-479d-ab68-6920f2b89a14
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	cc914a24-45b0-4b47-bc25-50eda3b6205b
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1cdecf67-791e-4486-82df-fd4d73e95e9e
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	b8657608-3715-456a-a893-067c084a3685
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	a7832ee9-77ca-499a-97c3-a77907495d57
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	b8657608-3715-456a-a893-067c084a3685
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	bf942e68-e846-479d-ab68-6920f2b89a14
f365b4ce-2639-4f36-8360-4e4bf1893736	cc914a24-45b0-4b47-bc25-50eda3b6205b
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	b96ee64d-e253-423d-ba83-74f97ac4c3c9
b96ee64d-e253-423d-ba83-74f97ac4c3c9	d493680e-317f-4f53-bf44-f690880e7068
ae71d77a-88db-4339-b282-65b25c88cc11	dcee6162-9793-4730-9042-1f09a12b3442
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	9e671124-9283-440e-b033-78ea9bbd9dbd
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	55cab3c6-7f3a-40f6-a08e-26b93a97e44c
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	e94135e9-92a3-4602-8702-a617e18c9c1c
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	a1697add-2f6a-4127-90be-5bfde733f768
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	d1d9dd17-94ba-42d7-a122-8475b19d0639
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	f52ffaee-78f9-4ebe-b013-f8741d82933c
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	90cf30cd-6fd0-4d38-aee1-c19b9f56d633
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	d6893ca5-d6a1-435d-8528-870732699dff
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	10a63084-8585-4be4-8692-46ee3e653b9f
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	61eaf023-6c9b-48d4-a2b3-9c5a39ad84c1
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	0f75cfa9-6a83-4b04-85b4-3dcaf1cab5de
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	285e7e1d-77ed-44b7-accf-f4d5bf095ab7
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5f80155e-0fe6-4cc3-8fab-6c48ee2c0efe
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	7ac543e3-8b35-492f-81c9-e5585f4603f4
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	a37b398e-cb79-4a86-a9d6-2c7168818fae
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	fb1f055c-bba7-4f49-a033-3384ddd66595
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5db07065-3bce-40ce-a161-ab9333c1f0e3
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	bcc7abe8-0ff7-485d-92a7-498faf092fd4
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1d83f7b0-db79-44d0-b4cf-c95cf0258787
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	e0be8eae-7bca-40c5-8738-2e06267bc604
90cf30cd-6fd0-4d38-aee1-c19b9f56d633	bcc7abe8-0ff7-485d-92a7-498faf092fd4
f52ffaee-78f9-4ebe-b013-f8741d82933c	e0be8eae-7bca-40c5-8738-2e06267bc604
f52ffaee-78f9-4ebe-b013-f8741d82933c	5db07065-3bce-40ce-a161-ab9333c1f0e3
4612214b-1cde-4c70-83f7-23dbbd890b22	9be90419-9032-4bb0-b9bb-9c0ca26d5997
4612214b-1cde-4c70-83f7-23dbbd890b22	d50a9a25-a5ed-43af-9425-b926775552c0
4612214b-1cde-4c70-83f7-23dbbd890b22	e9f52d13-a3eb-47f7-8454-1e139c4a7d77
4612214b-1cde-4c70-83f7-23dbbd890b22	e849fb7d-13a3-47f5-9d38-b5ecfa67b32b
4612214b-1cde-4c70-83f7-23dbbd890b22	ff49386c-4b0c-4767-b113-d936102a2f1e
4612214b-1cde-4c70-83f7-23dbbd890b22	ecb91741-9d6f-4005-aa7f-5cf1999a38e8
4612214b-1cde-4c70-83f7-23dbbd890b22	ab22584e-835d-452e-83b5-1c766e92e650
4612214b-1cde-4c70-83f7-23dbbd890b22	7cabef2f-e663-45ed-a793-97a05d6ddf1c
4612214b-1cde-4c70-83f7-23dbbd890b22	5d9cdef4-9a31-4001-b509-3865657c064f
4612214b-1cde-4c70-83f7-23dbbd890b22	cd3acaf0-f1ab-42da-bcbc-52f67cc2e25b
4612214b-1cde-4c70-83f7-23dbbd890b22	cfa12341-14be-4379-a684-108329e2f436
4612214b-1cde-4c70-83f7-23dbbd890b22	3caae9a5-955d-4f90-9b42-c5d29b49e56a
4612214b-1cde-4c70-83f7-23dbbd890b22	95e8bafd-556d-4eb9-9d63-f713ff8c4e0b
4612214b-1cde-4c70-83f7-23dbbd890b22	fcb10302-5268-47b3-bbea-07053b6eb85f
4612214b-1cde-4c70-83f7-23dbbd890b22	c21c9d5b-b875-48f2-8cfe-fb68e167948b
4612214b-1cde-4c70-83f7-23dbbd890b22	5f1d6431-6894-4248-8a62-15eb8d3c1301
4612214b-1cde-4c70-83f7-23dbbd890b22	3d9e2ca1-9924-42ef-9c0d-ddfa018b9d08
0c97ab63-82ea-4743-8749-7ea17ed95d1c	8c894ff1-e1b4-403e-a317-d441b62455ee
e849fb7d-13a3-47f5-9d38-b5ecfa67b32b	c21c9d5b-b875-48f2-8cfe-fb68e167948b
e9f52d13-a3eb-47f7-8454-1e139c4a7d77	fcb10302-5268-47b3-bbea-07053b6eb85f
e9f52d13-a3eb-47f7-8454-1e139c4a7d77	3d9e2ca1-9924-42ef-9c0d-ddfa018b9d08
0c97ab63-82ea-4743-8749-7ea17ed95d1c	c33cd985-c2a5-46f0-bbe8-a84bcac55442
c33cd985-c2a5-46f0-bbe8-a84bcac55442	5454b041-a278-448d-b7a6-21d8c05831e7
3e5643cc-3665-42b0-a94e-316ec8504205	d3981841-bf1b-47f2-9c79-ed6f07cca970
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	203e4db2-7c69-445e-ad92-e766dcf4591f
4612214b-1cde-4c70-83f7-23dbbd890b22	12e11aa8-09e5-497c-95b9-31747f1efbd1
0c97ab63-82ea-4743-8749-7ea17ed95d1c	3d3e7c9e-938d-4971-a2db-e9606ac6f353
0c97ab63-82ea-4743-8749-7ea17ed95d1c	e05c529c-b25e-4187-be27-28d6decad0cb
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
6857209b-c214-420e-96dd-22e25a641ffd	\N	password	5addde5e-fc0d-4716-bb94-47bdd9e711c4	1740481504084	\N	{"value":"0Xg1/hzvRe6lkri499IID/IVr7nqnPoCnxIITGBKF5U=","salt":"vbSaKwHP+7JuEanPsHrQLg==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10
7f09212e-d4a9-4346-b013-803cf8b8a6fa	\N	password	1d445807-c24e-4513-884d-22451ce9cf67	1740493722559	My password	{"value":"QfLbVcmF3Bwy3t+GoD5L494GiQ5vnf8sd0hI3/PwrII=","salt":"C+i8fXTKx+6UMFiAqmHd3A==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2025-02-25 11:04:55.738167	1	EXECUTED	9:6f1016664e21e16d26517a4418f5e3df	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.25.1	\N	\N	0481495017
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2025-02-25 11:04:55.770192	2	MARK_RAN	9:828775b1596a07d1200ba1d49e5e3941	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.25.1	\N	\N	0481495017
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2025-02-25 11:04:55.856568	3	EXECUTED	9:5f090e44a7d595883c1fb61f4b41fd38	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.25.1	\N	\N	0481495017
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2025-02-25 11:04:55.867243	4	EXECUTED	9:c07e577387a3d2c04d1adc9aaad8730e	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2025-02-25 11:04:56.043099	5	EXECUTED	9:b68ce996c655922dbcd2fe6b6ae72686	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.25.1	\N	\N	0481495017
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2025-02-25 11:04:56.05679	6	MARK_RAN	9:543b5c9989f024fe35c6f6c5a97de88e	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.25.1	\N	\N	0481495017
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2025-02-25 11:04:56.221407	7	EXECUTED	9:765afebbe21cf5bbca048e632df38336	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.25.1	\N	\N	0481495017
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2025-02-25 11:04:56.23387	8	MARK_RAN	9:db4a145ba11a6fdaefb397f6dbf829a1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.25.1	\N	\N	0481495017
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2025-02-25 11:04:56.246969	9	EXECUTED	9:9d05c7be10cdb873f8bcb41bc3a8ab23	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2025-02-25 11:04:56.402863	10	EXECUTED	9:18593702353128d53111f9b1ff0b82b8	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.25.1	\N	\N	0481495017
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2025-02-25 11:04:56.487846	11	EXECUTED	9:6122efe5f090e41a85c0f1c9e52cbb62	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2025-02-25 11:04:56.500237	12	MARK_RAN	9:e1ff28bf7568451453f844c5d54bb0b5	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2025-02-25 11:04:56.558157	13	EXECUTED	9:7af32cd8957fbc069f796b61217483fd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.639816	14	EXECUTED	9:6005e15e84714cd83226bf7879f54190	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.25.1	\N	\N	0481495017
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.662727	15	MARK_RAN	9:bf656f5a2b055d07f314431cae76f06c	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.682515	16	MARK_RAN	9:f8dadc9284440469dcf71e25ca6ab99b	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.25.1	\N	\N	0481495017
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.697355	17	EXECUTED	9:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.25.1	\N	\N	0481495017
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2025-02-25 11:04:56.835007	18	EXECUTED	9:3368ff0be4c2855ee2dd9ca813b38d8e	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.25.1	\N	\N	0481495017
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.917006	19	EXECUTED	9:8ac2fb5dd030b24c0570a763ed75ed20	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.25.1	\N	\N	0481495017
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.932807	20	EXECUTED	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.25.1	\N	\N	0481495017
24.0.0-9758-2	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.777899	119	EXECUTED	9:bf0fdee10afdf597a987adbf291db7b2	customChange		\N	4.25.1	\N	\N	0481495017
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.939828	21	MARK_RAN	9:831e82914316dc8a57dc09d755f23c51	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.25.1	\N	\N	0481495017
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.946737	22	MARK_RAN	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.25.1	\N	\N	0481495017
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2025-02-25 11:04:57.003867	23	EXECUTED	9:bc3d0f9e823a69dc21e23e94c7a94bb1	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.25.1	\N	\N	0481495017
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2025-02-25 11:04:57.018361	24	EXECUTED	9:c9999da42f543575ab790e76439a2679	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.25.1	\N	\N	0481495017
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2025-02-25 11:04:57.023212	25	MARK_RAN	9:0d6c65c6f58732d81569e77b10ba301d	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.25.1	\N	\N	0481495017
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2025-02-25 11:04:57.072093	26	EXECUTED	9:fc576660fc016ae53d2d4778d84d86d0	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.25.1	\N	\N	0481495017
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2025-02-25 11:04:57.179378	27	EXECUTED	9:43ed6b0da89ff77206289e87eaa9c024	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.25.1	\N	\N	0481495017
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2025-02-25 11:04:57.186414	28	EXECUTED	9:44bae577f551b3738740281eceb4ea70	update tableName=RESOURCE_SERVER_POLICY		\N	4.25.1	\N	\N	0481495017
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2025-02-25 11:04:57.266019	29	EXECUTED	9:bd88e1f833df0420b01e114533aee5e8	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.25.1	\N	\N	0481495017
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2025-02-25 11:04:57.295869	30	EXECUTED	9:a7022af5267f019d020edfe316ef4371	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.25.1	\N	\N	0481495017
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2025-02-25 11:04:57.361466	31	EXECUTED	9:fc155c394040654d6a79227e56f5e25a	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.25.1	\N	\N	0481495017
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2025-02-25 11:04:57.389335	32	EXECUTED	9:eac4ffb2a14795e5dc7b426063e54d88	customChange		\N	4.25.1	\N	\N	0481495017
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.408831	33	EXECUTED	9:54937c05672568c4c64fc9524c1e9462	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.415843	34	MARK_RAN	9:3a32bace77c84d7678d035a7f5a8084e	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.25.1	\N	\N	0481495017
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.480675	35	EXECUTED	9:33d72168746f81f98ae3a1e8e0ca3554	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.25.1	\N	\N	0481495017
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.496771	36	EXECUTED	9:61b6d3d7a4c0e0024b0c839da283da0c	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.505918	37	EXECUTED	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2025-02-25 11:04:57.52222	38	EXECUTED	9:a2b870802540cb3faa72098db5388af3	addColumn tableName=FED_USER_CONSENT		\N	4.25.1	\N	\N	0481495017
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2025-02-25 11:04:57.537228	39	EXECUTED	9:132a67499ba24bcc54fb5cbdcfe7e4c0	addColumn tableName=IDENTITY_PROVIDER		\N	4.25.1	\N	\N	0481495017
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.54106	40	MARK_RAN	9:938f894c032f5430f2b0fafb1a243462	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.25.1	\N	\N	0481495017
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.545823	41	MARK_RAN	9:845c332ff1874dc5d35974b0babf3006	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.25.1	\N	\N	0481495017
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.559467	42	EXECUTED	9:fc86359c079781adc577c5a217e4d04c	customChange		\N	4.25.1	\N	\N	0481495017
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.673779	43	EXECUTED	9:59a64800e3c0d09b825f8a3b444fa8f4	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.25.1	\N	\N	0481495017
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2025-02-25 11:04:57.685545	44	EXECUTED	9:d48d6da5c6ccf667807f633fe489ce88	addColumn tableName=USER_ENTITY		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.700666	45	EXECUTED	9:dde36f7973e80d71fceee683bc5d2951	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.723101	46	EXECUTED	9:b855e9b0a406b34fa323235a0cf4f640	customChange		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.734747	47	MARK_RAN	9:51abbacd7b416c50c4421a8cabf7927e	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.779347	48	EXECUTED	9:bdc99e567b3398bac83263d375aad143	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.25.1	\N	\N	0481495017
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.787654	49	EXECUTED	9:d198654156881c46bfba39abd7769e69	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2025-02-25 11:04:57.818667	50	EXECUTED	9:cfdd8736332ccdd72c5256ccb42335db	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.25.1	\N	\N	0481495017
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2025-02-25 11:04:57.846338	51	EXECUTED	9:7c84de3d9bd84d7f077607c1a4dcb714	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.25.1	\N	\N	0481495017
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2025-02-25 11:04:57.853114	52	EXECUTED	9:5a6bb36cbefb6a9d6928452c0852af2d	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2025-02-25 11:04:57.864494	53	EXECUTED	9:8f23e334dbc59f82e0a328373ca6ced0	update tableName=REALM		\N	4.25.1	\N	\N	0481495017
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2025-02-25 11:04:57.875727	54	EXECUTED	9:9156214268f09d970cdf0e1564d866af	update tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.88962	55	EXECUTED	9:db806613b1ed154826c02610b7dbdf74	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.25.1	\N	\N	0481495017
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.904303	56	EXECUTED	9:229a041fb72d5beac76bb94a5fa709de	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.926332	57	EXECUTED	9:079899dade9c1e683f26b2aa9ca6ff04	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:58.067993	58	EXECUTED	9:139b79bcbbfe903bb1c2d2a4dbf001d9	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.25.1	\N	\N	0481495017
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2025-02-25 11:04:58.112974	59	EXECUTED	9:b55738ad889860c625ba2bf483495a04	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.25.1	\N	\N	0481495017
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2025-02-25 11:04:58.126091	60	EXECUTED	9:e0057eac39aa8fc8e09ac6cfa4ae15fe	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.25.1	\N	\N	0481495017
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2025-02-25 11:04:58.154966	61	EXECUTED	9:42a33806f3a0443fe0e7feeec821326c	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.25.1	\N	\N	0481495017
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2025-02-25 11:04:58.1638	62	EXECUTED	9:9968206fca46eecc1f51db9c024bfe56	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.25.1	\N	\N	0481495017
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2025-02-25 11:04:58.171903	63	EXECUTED	9:92143a6daea0a3f3b8f598c97ce55c3d	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.25.1	\N	\N	0481495017
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2025-02-25 11:04:58.179235	64	EXECUTED	9:82bab26a27195d889fb0429003b18f40	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.185809	65	EXECUTED	9:e590c88ddc0b38b0ae4249bbfcb5abc3	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.208808	66	EXECUTED	9:5c1f475536118dbdc38d5d7977950cc0	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.217675	67	EXECUTED	9:e7c9f5f9c4d67ccbbcc215440c718a17	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.25.1	\N	\N	0481495017
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2025-02-25 11:04:58.227859	68	EXECUTED	9:88e0bfdda924690d6f4e430c53447dd5	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2025-02-25 11:04:58.251192	69	EXECUTED	9:f53177f137e1c46b6a88c59ec1cb5218	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.25.1	\N	\N	0481495017
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2025-02-25 11:04:58.263729	70	EXECUTED	9:a74d33da4dc42a37ec27121580d1459f	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.25.1	\N	\N	0481495017
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2025-02-25 11:04:58.272366	71	EXECUTED	9:fd4ade7b90c3b67fae0bfcfcb42dfb5f	addColumn tableName=RESOURCE_SERVER		\N	4.25.1	\N	\N	0481495017
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.294008	72	EXECUTED	9:aa072ad090bbba210d8f18781b8cebf4	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.308307	73	EXECUTED	9:1ae6be29bab7c2aa376f6983b932be37	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.313153	74	MARK_RAN	9:14706f286953fc9a25286dbd8fb30d97	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.349323	75	EXECUTED	9:2b9cc12779be32c5b40e2e67711a218b	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.25.1	\N	\N	0481495017
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.369403	76	EXECUTED	9:91fa186ce7a5af127a2d7a91ee083cc5	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.25.1	\N	\N	0481495017
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.376232	77	EXECUTED	9:6335e5c94e83a2639ccd68dd24e2e5ad	addColumn tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.379367	78	MARK_RAN	9:6bdb5658951e028bfe16fa0a8228b530	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.25.1	\N	\N	0481495017
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.398845	79	EXECUTED	9:d5bc15a64117ccad481ce8792d4c608f	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.25.1	\N	\N	0481495017
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.402045	80	MARK_RAN	9:077cba51999515f4d3e7ad5619ab592c	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.25.1	\N	\N	0481495017
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.410073	81	EXECUTED	9:be969f08a163bf47c6b9e9ead8ac2afb	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.41332	82	MARK_RAN	9:6d3bb4408ba5a72f39bd8a0b301ec6e3	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.421429	83	EXECUTED	9:966bda61e46bebf3cc39518fbed52fa7	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.424906	84	MARK_RAN	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.432822	85	EXECUTED	9:7d93d602352a30c0c317e6a609b56599	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2025-02-25 11:04:58.441184	86	EXECUTED	9:71c5969e6cdd8d7b6f47cebc86d37627	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.25.1	\N	\N	0481495017
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2025-02-25 11:04:58.451185	87	EXECUTED	9:a9ba7d47f065f041b7da856a81762021	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.25.1	\N	\N	0481495017
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2025-02-25 11:04:58.460078	88	EXECUTED	9:fffabce2bc01e1a8f5110d5278500065	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.25.1	\N	\N	0481495017
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.47152	89	EXECUTED	9:fa8a5b5445e3857f4b010bafb5009957	addColumn tableName=REALM; customChange		\N	4.25.1	\N	\N	0481495017
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.480234	90	EXECUTED	9:67ac3241df9a8582d591c5ed87125f39	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.486948	91	EXECUTED	9:ad1194d66c937e3ffc82386c050ba089	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.497219	92	EXECUTED	9:d9be619d94af5a2f5d07b9f003543b91	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.500184	93	MARK_RAN	9:544d201116a0fcc5a5da0925fbbc3bde	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.25.1	\N	\N	0481495017
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.518308	94	EXECUTED	9:43c0c1055b6761b4b3e89de76d612ccf	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.521582	95	MARK_RAN	9:8bd711fd0330f4fe980494ca43ab1139	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.25.1	\N	\N	0481495017
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.53144	96	EXECUTED	9:e07d2bc0970c348bb06fb63b1f82ddbf	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.540895	97	EXECUTED	9:24fb8611e97f29989bea412aa38d12b7	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.55014	98	MARK_RAN	9:259f89014ce2506ee84740cbf7163aa7	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.570054	99	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.585253	100	EXECUTED	9:60ca84a0f8c94ec8c3504a5a3bc88ee8	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.589011	101	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.598312	102	EXECUTED	9:0b305d8d1277f3a89a0a53a659ad274c	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.612232	103	EXECUTED	9:2c374ad2cdfe20e2905a84c8fac48460	customChange		\N	4.25.1	\N	\N	0481495017
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2025-02-25 11:04:58.624135	104	EXECUTED	9:47a760639ac597360a8219f5b768b4de	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.25.1	\N	\N	0481495017
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2025-02-25 11:04:58.631231	105	EXECUTED	9:a6272f0576727dd8cad2522335f5d99e	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.25.1	\N	\N	0481495017
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2025-02-25 11:04:58.638604	106	EXECUTED	9:015479dbd691d9cc8669282f4828c41d	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2025-02-25 11:04:58.647042	107	EXECUTED	9:9518e495fdd22f78ad6425cc30630221	customChange		\N	4.25.1	\N	\N	0481495017
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.654433	108	EXECUTED	9:e5f243877199fd96bcc842f27a1656ac	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.658124	109	MARK_RAN	9:1a6fcaa85e20bdeae0a9ce49b41946a5	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.674936	110	EXECUTED	9:3f332e13e90739ed0c35b0b25b7822ca	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
21.0.2-17277	keycloak	META-INF/jpa-changelog-21.0.2.xml	2025-02-25 11:04:58.687997	111	EXECUTED	9:7ee1f7a3fb8f5588f171fb9a6ab623c0	customChange		\N	4.25.1	\N	\N	0481495017
21.1.0-19404	keycloak	META-INF/jpa-changelog-21.1.0.xml	2025-02-25 11:04:58.708622	112	EXECUTED	9:3d7e830b52f33676b9d64f7f2b2ea634	modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER		\N	4.25.1	\N	\N	0481495017
21.1.0-19404-2	keycloak	META-INF/jpa-changelog-21.1.0.xml	2025-02-25 11:04:58.720113	113	MARK_RAN	9:627d032e3ef2c06c0e1f73d2ae25c26c	addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...		\N	4.25.1	\N	\N	0481495017
22.0.0-17484-updated	keycloak	META-INF/jpa-changelog-22.0.0.xml	2025-02-25 11:04:58.730536	114	EXECUTED	9:90af0bfd30cafc17b9f4d6eccd92b8b3	customChange		\N	4.25.1	\N	\N	0481495017
22.0.5-24031	keycloak	META-INF/jpa-changelog-22.0.0.xml	2025-02-25 11:04:58.733984	115	MARK_RAN	9:a60d2d7b315ec2d3eba9e2f145f9df28	customChange		\N	4.25.1	\N	\N	0481495017
23.0.0-12062	keycloak	META-INF/jpa-changelog-23.0.0.xml	2025-02-25 11:04:58.742908	116	EXECUTED	9:2168fbe728fec46ae9baf15bf80927b8	addColumn tableName=COMPONENT_CONFIG; update tableName=COMPONENT_CONFIG; dropColumn columnName=VALUE, tableName=COMPONENT_CONFIG; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=COMPONENT_CONFIG		\N	4.25.1	\N	\N	0481495017
23.0.0-17258	keycloak	META-INF/jpa-changelog-23.0.0.xml	2025-02-25 11:04:58.74914	117	EXECUTED	9:36506d679a83bbfda85a27ea1864dca8	addColumn tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
24.0.0-9758	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.76752	118	EXECUTED	9:502c557a5189f600f0f445a9b49ebbce	addColumn tableName=USER_ATTRIBUTE; addColumn tableName=FED_USER_ATTRIBUTE; createIndex indexName=USER_ATTR_LONG_VALUES, tableName=USER_ATTRIBUTE; createIndex indexName=FED_USER_ATTR_LONG_VALUES, tableName=FED_USER_ATTRIBUTE; createIndex indexName...		\N	4.25.1	\N	\N	0481495017
24.0.0-26618-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.785813	120	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.0-26618-reindex	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.793909	121	EXECUTED	9:08707c0f0db1cef6b352db03a60edc7f	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.2-27228	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.801763	122	EXECUTED	9:eaee11f6b8aa25d2cc6a84fb86fc6238	customChange		\N	4.25.1	\N	\N	0481495017
24.0.2-27967-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.804654	123	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.2-27967-reindex	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.808684	124	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
18.0.15-30992-index-consent	keycloak	META-INF/jpa-changelog-18.0.15.xml	2025-02-25 14:20:50.39707	125	EXECUTED	9:80071ede7a05604b1f4906f3bf3b00f0	createIndex indexName=IDX_USCONSENT_SCOPE_ID, tableName=USER_CONSENT_CLIENT_SCOPE		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-tables	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.435505	126	EXECUTED	9:deda2df035df23388af95bbd36c17cef	addColumn tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_CLIENT_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.633942	127	EXECUTED	9:3e96709818458ae49f3c679ae58d263a	createIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-cleanup-uss-createdon	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.741128	128	EXECUTED	9:78ab4fc129ed5e8265dbcc3485fba92f	dropIndex indexName=IDX_OFFLINE_USS_CREATEDON, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-cleanup-uss-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.807384	129	EXECUTED	9:de5f7c1f7e10994ed8b62e621d20eaab	dropIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-cleanup-uss-by-usersess	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.870834	130	EXECUTED	9:6eee220d024e38e89c799417ec33667f	dropIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-cleanup-css-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.93513	131	EXECUTED	9:5411d2fb2891d3e8d63ddb55dfa3c0c9	dropIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-2-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:50.941582	132	MARK_RAN	9:b7ef76036d3126bb83c2423bf4d449d6	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-28265-index-2-not-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:51.055778	133	EXECUTED	9:23396cf51ab8bc1ae6f0cac7f9f6fcf7	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.29.1	\N	\N	0493250171
25.0.0-org	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:51.091229	134	EXECUTED	9:5c859965c2c9b9c72136c360649af157	createTable tableName=ORG; addUniqueConstraint constraintName=UK_ORG_NAME, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_GROUP, tableName=ORG; createTable tableName=ORG_DOMAIN		\N	4.29.1	\N	\N	0493250171
unique-consentuser	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:51.12796	135	EXECUTED	9:5857626a2ea8767e9a6c66bf3a2cb32f	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.29.1	\N	\N	0493250171
unique-consentuser-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:51.133149	136	MARK_RAN	9:b79478aad5adaa1bc428e31563f55e8e	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.29.1	\N	\N	0493250171
25.0.0-28861-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2025-02-25 14:20:51.334436	137	EXECUTED	9:b9acb58ac958d9ada0fe12a5d4794ab1	createIndex indexName=IDX_PERM_TICKET_REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; createIndex indexName=IDX_PERM_TICKET_OWNER, tableName=RESOURCE_SERVER_PERM_TICKET		\N	4.29.1	\N	\N	0493250171
26.0.0-org-alias	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.351692	138	EXECUTED	9:6ef7d63e4412b3c2d66ed179159886a4	addColumn tableName=ORG; update tableName=ORG; addNotNullConstraint columnName=ALIAS, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_ALIAS, tableName=ORG		\N	4.29.1	\N	\N	0493250171
26.0.0-org-group	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.375416	139	EXECUTED	9:da8e8087d80ef2ace4f89d8c5b9ca223	addColumn tableName=KEYCLOAK_GROUP; update tableName=KEYCLOAK_GROUP; addNotNullConstraint columnName=TYPE, tableName=KEYCLOAK_GROUP; customChange		\N	4.29.1	\N	\N	0493250171
26.0.0-org-indexes	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.464862	140	EXECUTED	9:79b05dcd610a8c7f25ec05135eec0857	createIndex indexName=IDX_ORG_DOMAIN_ORG_ID, tableName=ORG_DOMAIN		\N	4.29.1	\N	\N	0493250171
26.0.0-org-group-membership	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.519614	141	EXECUTED	9:a6ace2ce583a421d89b01ba2a28dc2d4	addColumn tableName=USER_GROUP_MEMBERSHIP; update tableName=USER_GROUP_MEMBERSHIP; addNotNullConstraint columnName=MEMBERSHIP_TYPE, tableName=USER_GROUP_MEMBERSHIP		\N	4.29.1	\N	\N	0493250171
31296-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.561614	142	EXECUTED	9:64ef94489d42a358e8304b0e245f0ed4	createTable tableName=REVOKED_TOKEN; addPrimaryKey constraintName=CONSTRAINT_RT, tableName=REVOKED_TOKEN		\N	4.29.1	\N	\N	0493250171
31725-index-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.682334	143	EXECUTED	9:b994246ec2bf7c94da881e1d28782c7b	createIndex indexName=IDX_REV_TOKEN_ON_EXPIRE, tableName=REVOKED_TOKEN		\N	4.29.1	\N	\N	0493250171
26.0.0-idps-for-login	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.857966	144	EXECUTED	9:51f5fffadf986983d4bd59582c6c1604	addColumn tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_REALM_ORG, tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER; customChange		\N	4.29.1	\N	\N	0493250171
26.0.0-32583-drop-redundant-index-on-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.907945	145	EXECUTED	9:24972d83bf27317a055d234187bb4af9	dropIndex indexName=IDX_US_SESS_ID_ON_CL_SESS, tableName=OFFLINE_CLIENT_SESSION		\N	4.29.1	\N	\N	0493250171
26.0.0.32582-remove-tables-user-session-user-session-note-and-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.942481	146	EXECUTED	9:febdc0f47f2ed241c59e60f58c3ceea5	dropTable tableName=CLIENT_SESSION_ROLE; dropTable tableName=CLIENT_SESSION_NOTE; dropTable tableName=CLIENT_SESSION_PROT_MAPPER; dropTable tableName=CLIENT_SESSION_AUTH_STATUS; dropTable tableName=CLIENT_USER_SESSION_NOTE; dropTable tableName=CLI...		\N	4.29.1	\N	\N	0493250171
26.0.0-33201-org-redirect-url	keycloak	META-INF/jpa-changelog-26.0.0.xml	2025-02-25 14:20:51.953644	147	EXECUTED	9:4d0e22b0ac68ebe9794fa9cb752ea660	addColumn tableName=ORG		\N	4.29.1	\N	\N	0493250171
26.0.6-34013	keycloak	META-INF/jpa-changelog-26.0.6.xml	2025-02-25 14:20:51.967178	148	EXECUTED	9:e6b686a15759aef99a6d758a5c4c6a26	addColumn tableName=ADMIN_EVENT_ENTITY		\N	4.29.1	\N	\N	0493250171
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	a7c717f5-275c-4276-beef-8bb8e0322ad2	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	865ea21d-5993-4a7f-ad32-27db092d5270	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	2d9c822f-439e-43e3-acf4-feb12d41f606	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	9199e97e-bceb-40ea-92c5-3d174a10455e	t
3dae0dec-5d92-4955-af55-89d9c775206b	e0a36a51-2daf-4275-a163-5d03949f8dfe	f
3dae0dec-5d92-4955-af55-89d9c775206b	77019f9f-423b-4bc8-bc80-9490337268d0	t
3dae0dec-5d92-4955-af55-89d9c775206b	802b8283-0517-4e61-93df-33bb547efd6b	t
3dae0dec-5d92-4955-af55-89d9c775206b	40b02902-2943-4d35-8d99-6835d035fbec	t
3dae0dec-5d92-4955-af55-89d9c775206b	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7	t
3dae0dec-5d92-4955-af55-89d9c775206b	f1176d92-c514-43e6-894f-709142e29dd5	f
3dae0dec-5d92-4955-af55-89d9c775206b	e810d4dd-4069-4853-8ac7-708ccc1ee092	f
3dae0dec-5d92-4955-af55-89d9c775206b	6968fef2-dcf0-4af4-b3c9-936368437b29	t
3dae0dec-5d92-4955-af55-89d9c775206b	cc438969-bd98-4481-94da-976d776ebc57	t
3dae0dec-5d92-4955-af55-89d9c775206b	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb	f
3dae0dec-5d92-4955-af55-89d9c775206b	ff161937-a987-4f12-af5b-3da8534c0835	t
3dae0dec-5d92-4955-af55-89d9c775206b	9be2e5c8-7d15-46be-a7b3-04811cb8ec97	t
3dae0dec-5d92-4955-af55-89d9c775206b	cd17b920-5ad4-43bf-8a05-2969f69e80a4	f
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id, details_json_long_value) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only, organization_id, hide_on_login) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.keycloak_group (id, name, parent_group, realm_id, type) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_default-roles}	default-roles-master	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_admin}	admin	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
576695fb-214c-46fb-920a-5f37daccd8db	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_create-realm}	create-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
4a113f85-5fef-441b-b9fc-e9e274176d68	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_create-client}	create-client	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
fead0a36-0ac3-45c9-8dd5-4c46fc821e5b	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-realm}	view-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-users}	view-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
f365b4ce-2639-4f36-8360-4e4bf1893736	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-clients}	view-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
2d16f16e-a30d-48c1-b543-28e3cef5ea64	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-events}	view-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
b997a6f3-72b8-4a3d-b638-c1c9f1340d07	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-identity-providers}	view-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
3fdf4e0f-4d93-4962-bbf5-2ada51626463	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-authorization}	view-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
8833c6b0-ad0b-4f81-be0a-f40c36cda8fd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-realm}	manage-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
ee457df1-997d-4007-a91f-68f606b76802	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-users}	manage-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
f80e1181-0306-4dfe-91a6-6c2ada6a7013	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-clients}	manage-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
152d8406-23ba-48d9-b26b-c59d471bfd8a	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-events}	manage-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
381d870b-aeb0-444f-8294-5e24ad05c049	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-identity-providers}	manage-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
1496f35b-23cb-4df8-a7a7-5dd0ab9deb54	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-authorization}	manage-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
bf942e68-e846-479d-ab68-6920f2b89a14	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-users}	query-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
cc914a24-45b0-4b47-bc25-50eda3b6205b	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-clients}	query-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
1cdecf67-791e-4486-82df-fd4d73e95e9e	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-realms}	query-realms	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
b8657608-3715-456a-a893-067c084a3685	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-groups}	query-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
a7832ee9-77ca-499a-97c3-a77907495d57	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-profile}	view-profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
b96ee64d-e253-423d-ba83-74f97ac4c3c9	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-account}	manage-account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
d493680e-317f-4f53-bf44-f690880e7068	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-account-links}	manage-account-links	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
9d4ff15b-004d-4bf8-a3de-307243e10ca8	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-applications}	view-applications	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
dcee6162-9793-4730-9042-1f09a12b3442	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-consent}	view-consent	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
ae71d77a-88db-4339-b282-65b25c88cc11	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-consent}	manage-consent	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
3e7aa68c-3e39-40fe-add5-feea461c5b2b	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-groups}	view-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
4693d4d2-d601-4d3d-9eb7-511fc4d0b44a	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_delete-account}	delete-account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
f4fb053c-6b8e-471d-8ff6-84c4bcb0042e	cf8c636a-969c-4676-a664-99f5bcef27c3	t	${role_read-token}	read-token	767d9b8d-d1e0-46e8-8336-872e7ee443dd	cf8c636a-969c-4676-a664-99f5bcef27c3	\N
9e671124-9283-440e-b033-78ea9bbd9dbd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_impersonation}	impersonation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
55cab3c6-7f3a-40f6-a08e-26b93a97e44c	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_offline-access}	offline_access	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
e94135e9-92a3-4602-8702-a617e18c9c1c	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_uma_authorization}	uma_authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
0c97ab63-82ea-4743-8749-7ea17ed95d1c	3dae0dec-5d92-4955-af55-89d9c775206b	f	${role_default-roles}	default-roles-measurestream	3dae0dec-5d92-4955-af55-89d9c775206b	\N	\N
a1697add-2f6a-4127-90be-5bfde733f768	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_create-client}	create-client	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
d1d9dd17-94ba-42d7-a122-8475b19d0639	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-realm}	view-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
f52ffaee-78f9-4ebe-b013-f8741d82933c	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-users}	view-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
90cf30cd-6fd0-4d38-aee1-c19b9f56d633	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-clients}	view-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
d6893ca5-d6a1-435d-8528-870732699dff	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-events}	view-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
10a63084-8585-4be4-8692-46ee3e653b9f	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-identity-providers}	view-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
61eaf023-6c9b-48d4-a2b3-9c5a39ad84c1	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_view-authorization}	view-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
0f75cfa9-6a83-4b04-85b4-3dcaf1cab5de	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-realm}	manage-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
285e7e1d-77ed-44b7-accf-f4d5bf095ab7	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-users}	manage-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
5f80155e-0fe6-4cc3-8fab-6c48ee2c0efe	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-clients}	manage-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
7ac543e3-8b35-492f-81c9-e5585f4603f4	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-events}	manage-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
a37b398e-cb79-4a86-a9d6-2c7168818fae	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-identity-providers}	manage-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
fb1f055c-bba7-4f49-a033-3384ddd66595	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_manage-authorization}	manage-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
5db07065-3bce-40ce-a161-ab9333c1f0e3	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_query-users}	query-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
bcc7abe8-0ff7-485d-92a7-498faf092fd4	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_query-clients}	query-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
1d83f7b0-db79-44d0-b4cf-c95cf0258787	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_query-realms}	query-realms	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
e0be8eae-7bca-40c5-8738-2e06267bc604	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_query-groups}	query-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
4612214b-1cde-4c70-83f7-23dbbd890b22	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_realm-admin}	realm-admin	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
9be90419-9032-4bb0-b9bb-9c0ca26d5997	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_create-client}	create-client	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
d50a9a25-a5ed-43af-9425-b926775552c0	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-realm}	view-realm	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
e9f52d13-a3eb-47f7-8454-1e139c4a7d77	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-users}	view-users	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
e849fb7d-13a3-47f5-9d38-b5ecfa67b32b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-clients}	view-clients	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
ff49386c-4b0c-4767-b113-d936102a2f1e	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-events}	view-events	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
ecb91741-9d6f-4005-aa7f-5cf1999a38e8	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-identity-providers}	view-identity-providers	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
ab22584e-835d-452e-83b5-1c766e92e650	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_view-authorization}	view-authorization	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
7cabef2f-e663-45ed-a793-97a05d6ddf1c	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-realm}	manage-realm	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
5d9cdef4-9a31-4001-b509-3865657c064f	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-users}	manage-users	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
cd3acaf0-f1ab-42da-bcbc-52f67cc2e25b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-clients}	manage-clients	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
cfa12341-14be-4379-a684-108329e2f436	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-events}	manage-events	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
3caae9a5-955d-4f90-9b42-c5d29b49e56a	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-identity-providers}	manage-identity-providers	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
95e8bafd-556d-4eb9-9d63-f713ff8c4e0b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_manage-authorization}	manage-authorization	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
fcb10302-5268-47b3-bbea-07053b6eb85f	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_query-users}	query-users	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
c21c9d5b-b875-48f2-8cfe-fb68e167948b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_query-clients}	query-clients	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
5f1d6431-6894-4248-8a62-15eb8d3c1301	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_query-realms}	query-realms	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
3d9e2ca1-9924-42ef-9c0d-ddfa018b9d08	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_query-groups}	query-groups	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
8c894ff1-e1b4-403e-a317-d441b62455ee	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_view-profile}	view-profile	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
c33cd985-c2a5-46f0-bbe8-a84bcac55442	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_manage-account}	manage-account	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
5454b041-a278-448d-b7a6-21d8c05831e7	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_manage-account-links}	manage-account-links	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
d8f84abc-cc72-45ca-8fe9-8c4a036d6363	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_view-applications}	view-applications	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
d3981841-bf1b-47f2-9c79-ed6f07cca970	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_view-consent}	view-consent	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
3e5643cc-3665-42b0-a94e-316ec8504205	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_manage-consent}	manage-consent	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
6e381440-d0f7-4bef-a276-340991bf8c7f	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_view-groups}	view-groups	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
f97acbb6-2d3b-4002-b782-b12c70d1a5b3	d297f344-051c-4d34-8665-18b02a58d96c	t	${role_delete-account}	delete-account	3dae0dec-5d92-4955-af55-89d9c775206b	d297f344-051c-4d34-8665-18b02a58d96c	\N
203e4db2-7c69-445e-ad92-e766dcf4591f	e6af9fc1-f8d6-4053-849d-2b44d236bf87	t	${role_impersonation}	impersonation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e6af9fc1-f8d6-4053-849d-2b44d236bf87	\N
12e11aa8-09e5-497c-95b9-31747f1efbd1	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	t	${role_impersonation}	impersonation	3dae0dec-5d92-4955-af55-89d9c775206b	2fbcdc07-54cc-44a9-a5c0-5fbc0ebe7437	\N
b05337e5-99d4-4a57-b7de-9b259baf1930	5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	t	${role_read-token}	read-token	3dae0dec-5d92-4955-af55-89d9c775206b	5179a4e3-ce14-4d19-8c95-6a187e0bd4bc	\N
3d3e7c9e-938d-4971-a2db-e9606ac6f353	3dae0dec-5d92-4955-af55-89d9c775206b	f	${role_offline-access}	offline_access	3dae0dec-5d92-4955-af55-89d9c775206b	\N	\N
e05c529c-b25e-4187-be27-28d6decad0cb	3dae0dec-5d92-4955-af55-89d9c775206b	f	${role_uma_authorization}	uma_authorization	3dae0dec-5d92-4955-af55-89d9c775206b	\N	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.migration_model (id, version, update_time) FROM stdin;
7mn31	24.0.5	1740481499
olm38	26.0.8	1740493253
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id, version) FROM stdin;
c5231446-f06f-4e20-8ac2-84c78a30caf6	71d0319e-df6f-4a71-8f4a-353fc8b57122	1	1740567199	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740567199","iss":"http://172.20.0.22:8080/realms/measurestream","startedAt":"1740567199","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"GPF3xvja6EsQKhLNns1riQLsNLrVYPqobEpF0LEL9ek=","nonce":"JCeAui47XwyKxTAU6YIZZTswQed_DGBnRK-pAsV-KRw"}}	local	local	0
311bbe0a-200a-4496-a8b8-86139add1115	71d0319e-df6f-4a71-8f4a-353fc8b57122	1	1740493729	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740493729","iss":"http://localhost:8081/realms/measurestream","startedAt":"1740493729","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"hnw7T9IoByciLxx9qgnujCpQtQIv6ON54BADQjgmDYw=","nonce":"PZLjdtj1i9av_TbuoE4ckbEQomV8XTyOFNqsenmN1JU"}}	local	local	0
f4cc7350-0569-41ee-a7e7-3a213e78d09c	71d0319e-df6f-4a71-8f4a-353fc8b57122	1	1740568277	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740568002","iss":"http://172.20.0.22:8080/realms/measurestream","startedAt":"1740568002","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"GTLzb7zlKW06usIm_oW6Wq5xCOoC0kHU3Ys0LJ1aDyQ=","nonce":"weAUhMsv33qqr_zgsIxKdov11AhooCyRPe40OIkTMvg"}}	local	local	1
3046d5a4-0a36-4b8c-bfd2-c8491b0eca17	71d0319e-df6f-4a71-8f4a-353fc8b57122	1	1740569708	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740569708","iss":"http://172.20.0.22:8080/realms/measurestream","startedAt":"1740569708","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"rJ3DURjMtF5De5P1CXrV-BASOHFJafqHMYDF8kvvW4M=","nonce":"RLQ4nUM7T46-Rm8nMFrLee04SZa0lYRAwJn2b5n178I"}}	local	local	0
763cdb0c-af08-45d6-afc4-6f31dccbeebc	71d0319e-df6f-4a71-8f4a-353fc8b57122	0	1740579613	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740579613","iss":"http://172.20.0.22:8080/realms/measurestream","startedAt":"1740579613","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"Mh4iUY19EHaD-VCoWxftwaynPez-y9jA-8nAVChPxYo=","nonce":"wCQB4Pjf2Ojp9WjqBF4wdHw9dodG9enP8SMcZB0DZx4"}}	local	local	0
763cdb0c-af08-45d6-afc4-6f31dccbeebc	71d0319e-df6f-4a71-8f4a-353fc8b57122	1	1740579613	{"authMethod":"openid-connect","redirectUri":"http://localhost:8080/login/oauth2/code/gateway","notes":{"clientId":"71d0319e-df6f-4a71-8f4a-353fc8b57122","scope":"openid offline_access","userSessionStartedAt":"1740579613","iss":"http://172.20.0.22:8080/realms/measurestream","startedAt":"1740579613","response_type":"code","level-of-authentication":"-1","redirect_uri":"http://localhost:8080/login/oauth2/code/gateway","state":"Mh4iUY19EHaD-VCoWxftwaynPez-y9jA-8nAVChPxYo=","nonce":"wCQB4Pjf2Ojp9WjqBF4wdHw9dodG9enP8SMcZB0DZx4"}}	local	local	0
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh, broker_session_id, version) FROM stdin;
311bbe0a-200a-4496-a8b8-86139add1115	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740493729	1	{"ipAddress":"172.26.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjYuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740493729","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740493729}"},"state":"LOGGED_IN"}	1740494237	\N	2
c5231446-f06f-4e20-8ac2-84c78a30caf6	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740567199	1	{"ipAddress":"172.20.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjAuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740567199","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740567199}"},"state":"LOGGED_IN"}	1740567960	\N	3
f4cc7350-0569-41ee-a7e7-3a213e78d09c	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740568002	1	{"ipAddress":"172.20.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjAuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740568002","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740568002}"},"state":"LOGGED_IN"}	1740569650	\N	3
3046d5a4-0a36-4b8c-bfd2-c8491b0eca17	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740569708	1	{"ipAddress":"172.20.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjAuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740569708","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740569708}"},"state":"LOGGED_IN"}	1740569708	\N	0
763cdb0c-af08-45d6-afc4-6f31dccbeebc	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740579613	0	{"ipAddress":"172.20.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjAuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740579613","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740579612}"},"state":"LOGGED_IN"}	1740579613	\N	0
763cdb0c-af08-45d6-afc4-6f31dccbeebc	1d445807-c24e-4513-884d-22451ce9cf67	3dae0dec-5d92-4955-af55-89d9c775206b	1740579613	1	{"ipAddress":"172.20.0.1","authMethod":"openid-connect","rememberMe":false,"started":0,"notes":{"KC_DEVICE_NOTE":"eyJpcEFkZHJlc3MiOiIxNzIuMjAuMC4xIiwib3MiOiJMaW51eCIsIm9zVmVyc2lvbiI6IlVua25vd24iLCJicm93c2VyIjoiRmlyZWZveC8xMzUuMCIsImRldmljZSI6Ik90aGVyIiwibGFzdEFjY2VzcyI6MCwibW9iaWxlIjpmYWxzZX0=","AUTH_TIME":"1740579613","authenticators-completed":"{\\"b7dd0af2-33d2-404c-ba52-3d6ff9a2db14\\":1740579612}"},"state":"LOGGED_IN"}	1740579613	\N	0
\.


--
-- Data for Name: org; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.org (id, enabled, realm_id, group_id, name, description, alias, redirect_url) FROM stdin;
\.


--
-- Data for Name: org_domain; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.org_domain (id, name, verified, org_id) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
33c234ce-9593-4e34-8037-cac0b4f550cb	audience resolve	openid-connect	oidc-audience-resolve-mapper	21f5e158-9ae0-47eb-a8af-5e5413d0f224	\N
00452457-42c0-470d-be15-1da6807a158b	locale	openid-connect	oidc-usermodel-attribute-mapper	fec6b05c-1521-42c8-b5eb-e83a00d28125	\N
134fdb66-4e00-4baa-b641-0f0066b7c7eb	role list	saml	saml-role-list-mapper	\N	a7c717f5-275c-4276-beef-8bb8e0322ad2
3f8180d1-80f8-4735-b5ab-30345bc6a55b	full name	openid-connect	oidc-full-name-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
d4dfb855-8cb3-4308-95d3-a82ff7a87551	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
113d0a02-b221-464f-9e41-d6f3f8a79b93	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
15005cbd-8493-4861-a3d0-e554f993df32	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
1690b67b-703f-42be-bd7d-fa9906034b50	username	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
a70468af-db28-4313-b670-4b930b76849b	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
c4bd154a-a2d6-4888-af25-ade3316d6107	email	openid-connect	oidc-usermodel-attribute-mapper	\N	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81
14b19528-41bd-46f6-aa1c-edc8c43150d8	email verified	openid-connect	oidc-usermodel-property-mapper	\N	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81
385e8a4f-a2aa-4231-9bab-dd18d9150083	address	openid-connect	oidc-address-mapper	\N	9fc9c2dc-e827-4104-a13f-3d2c84191815
56a12d7d-4891-48a5-b23d-195b558b8828	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	865ea21d-5993-4a7f-ad32-27db092d5270
8af9bfb7-caf4-454b-840b-0f5f2760968c	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	865ea21d-5993-4a7f-ad32-27db092d5270
3ee8f1f6-08fe-4821-8f09-02a22a065b57	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
abea88c9-f648-4395-97e1-46dfe8ec8faa	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
5469604c-e44f-4181-8c10-88e9d7ac6209	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
a7b67101-57b6-46f6-a7ee-0c2083718da9	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	9bf3ba39-3566-4bd5-b772-0214d0d50487
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	09bb941f-dcd2-4bad-8bb8-33e32d7c2405
ade61f00-8330-4bdd-b393-ca139d5127ff	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	09bb941f-dcd2-4bad-8bb8-33e32d7c2405
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	acr loa level	openid-connect	oidc-acr-mapper	\N	2d9c822f-439e-43e3-acf4-feb12d41f606
a7f419e6-245b-4570-919d-ac39a70151c5	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	9199e97e-bceb-40ea-92c5-3d174a10455e
32a33c6a-cdcd-45a5-9e80-42cf31689e49	sub	openid-connect	oidc-sub-mapper	\N	9199e97e-bceb-40ea-92c5-3d174a10455e
c479bc38-13fc-4ccd-bf52-90cdb7136bf0	audience resolve	openid-connect	oidc-audience-resolve-mapper	4f9520df-706f-40c5-a2d3-761c3be7b1bf	\N
3ad576dd-3ede-4eac-938f-50e3791edd6c	role list	saml	saml-role-list-mapper	\N	77019f9f-423b-4bc8-bc80-9490337268d0
151c1e2a-409d-4fb1-9705-50d851bb461a	organization	saml	saml-organization-membership-mapper	\N	802b8283-0517-4e61-93df-33bb547efd6b
4e87537f-4d0d-44c5-a0fd-c48fecf2232b	full name	openid-connect	oidc-full-name-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
1950336c-0153-4d6e-a0c0-4b6bafef971c	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
5af286c5-e399-4f0c-b52b-ed74b90196e3	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
cc1ee616-3a98-4acf-a690-2d2af33f8300	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
72c0e454-0e79-445d-91ce-c988deecfb9c	username	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
03c2389f-8f91-4341-8a70-2a516729ddb4	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
ac995a0b-6c2b-4f4b-8227-b16635193a9e	website	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
7748a3e2-cd3f-4ca0-b605-93b223aeea12	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
12b7662b-3939-4ed4-b05b-85db9293dfda	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
c740220d-a6d4-4580-b107-41187151f185	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
b5f357c0-1e38-46da-b44e-6a8f05583799	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
8b5d7315-8f87-438b-a7a5-01aa018706fc	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	40b02902-2943-4d35-8d99-6835d035fbec
29eaae7f-df01-4a3c-ac86-fd6948c5674b	email	openid-connect	oidc-usermodel-attribute-mapper	\N	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7
31eaa742-8f55-4c36-b745-3aad8863dbc3	email verified	openid-connect	oidc-usermodel-property-mapper	\N	83b5aaae-c1b0-4c85-adb3-ea6030c86cd7
a117eea7-1392-48af-88d3-f4558d446406	address	openid-connect	oidc-address-mapper	\N	f1176d92-c514-43e6-894f-709142e29dd5
63c044b6-a178-4148-9bcd-7547fbcbec66	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	e810d4dd-4069-4853-8ac7-708ccc1ee092
9c324cff-5210-4a12-9bd1-7422011e0cc3	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	e810d4dd-4069-4853-8ac7-708ccc1ee092
6fbb9510-2076-4677-adc3-21138f8206b4	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	6968fef2-dcf0-4af4-b3c9-936368437b29
d77b16cb-5893-4935-94aa-d702d85e1da3	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	6968fef2-dcf0-4af4-b3c9-936368437b29
ccf80e6a-3950-4328-91ce-5febe2823c00	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	6968fef2-dcf0-4af4-b3c9-936368437b29
8d5135ac-8e7b-4b4d-8732-bbe8c47ffdc6	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	cc438969-bd98-4481-94da-976d776ebc57
4e67af7c-77c0-441a-8c41-7db37023c8e5	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	39cdc9a8-d59e-4ea7-a71e-daa9993efdbb
642aa1fd-242e-44a3-a3ce-2bc78570baa1	acr loa level	openid-connect	oidc-acr-mapper	\N	ff161937-a987-4f12-af5b-3da8534c0835
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	9be2e5c8-7d15-46be-a7b3-04811cb8ec97
fea3c149-e0a9-4fb0-a822-f3134722cdbc	sub	openid-connect	oidc-sub-mapper	\N	9be2e5c8-7d15-46be-a7b3-04811cb8ec97
72b7ae67-7804-4666-9af8-3c7058c50564	organization	openid-connect	oidc-organization-membership-mapper	\N	cd17b920-5ad4-43bf-8a05-2969f69e80a4
640f97df-ea5b-4691-a60b-c98c161d33c8	locale	openid-connect	oidc-usermodel-attribute-mapper	947eed23-7adc-4635-b18e-9c151c1aa27c	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
00452457-42c0-470d-be15-1da6807a158b	true	introspection.token.claim
00452457-42c0-470d-be15-1da6807a158b	true	userinfo.token.claim
00452457-42c0-470d-be15-1da6807a158b	locale	user.attribute
00452457-42c0-470d-be15-1da6807a158b	true	id.token.claim
00452457-42c0-470d-be15-1da6807a158b	true	access.token.claim
00452457-42c0-470d-be15-1da6807a158b	locale	claim.name
00452457-42c0-470d-be15-1da6807a158b	String	jsonType.label
134fdb66-4e00-4baa-b641-0f0066b7c7eb	false	single
134fdb66-4e00-4baa-b641-0f0066b7c7eb	Basic	attribute.nameformat
134fdb66-4e00-4baa-b641-0f0066b7c7eb	Role	attribute.name
08829d89-686e-41f7-823b-f9279dd3ee53	true	introspection.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	true	userinfo.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	user.attribute
08829d89-686e-41f7-823b-f9279dd3ee53	true	id.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	true	access.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	claim.name
08829d89-686e-41f7-823b-f9279dd3ee53	String	jsonType.label
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	introspection.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	userinfo.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	firstName	user.attribute
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	id.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	access.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	given_name	claim.name
113d0a02-b221-464f-9e41-d6f3f8a79b93	String	jsonType.label
15005cbd-8493-4861-a3d0-e554f993df32	true	introspection.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	true	userinfo.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	middleName	user.attribute
15005cbd-8493-4861-a3d0-e554f993df32	true	id.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	true	access.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	middle_name	claim.name
15005cbd-8493-4861-a3d0-e554f993df32	String	jsonType.label
1690b67b-703f-42be-bd7d-fa9906034b50	true	introspection.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	true	userinfo.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	username	user.attribute
1690b67b-703f-42be-bd7d-fa9906034b50	true	id.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	true	access.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	preferred_username	claim.name
1690b67b-703f-42be-bd7d-fa9906034b50	String	jsonType.label
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	introspection.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	userinfo.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updatedAt	user.attribute
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	id.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	access.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updated_at	claim.name
2182a3d9-9e21-43bb-b4a6-728b38bec64e	long	jsonType.label
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	introspection.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	userinfo.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	user.attribute
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	id.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	access.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	claim.name
29937222-642e-42b2-b82a-3ffd7c78ecf1	String	jsonType.label
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	introspection.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	userinfo.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	id.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	access.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	introspection.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	userinfo.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	user.attribute
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	id.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	access.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	claim.name
5caeac20-24e2-4a79-925c-f3c72273e2ec	String	jsonType.label
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	introspection.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	userinfo.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	user.attribute
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	id.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	access.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	claim.name
68068ab6-59c2-4c14-b400-16c9b85a4a98	String	jsonType.label
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	introspection.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	userinfo.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	user.attribute
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	id.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	access.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	claim.name
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	String	jsonType.label
a70468af-db28-4313-b670-4b930b76849b	true	introspection.token.claim
a70468af-db28-4313-b670-4b930b76849b	true	userinfo.token.claim
a70468af-db28-4313-b670-4b930b76849b	picture	user.attribute
a70468af-db28-4313-b670-4b930b76849b	true	id.token.claim
a70468af-db28-4313-b670-4b930b76849b	true	access.token.claim
a70468af-db28-4313-b670-4b930b76849b	picture	claim.name
a70468af-db28-4313-b670-4b930b76849b	String	jsonType.label
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	introspection.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	userinfo.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	user.attribute
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	id.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	access.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	claim.name
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	String	jsonType.label
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	introspection.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	userinfo.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	lastName	user.attribute
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	id.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	access.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	family_name	claim.name
d4dfb855-8cb3-4308-95d3-a82ff7a87551	String	jsonType.label
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	introspection.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	userinfo.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	user.attribute
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	id.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	access.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	claim.name
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	String	jsonType.label
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	introspection.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	userinfo.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	emailVerified	user.attribute
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	id.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	access.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	email_verified	claim.name
14b19528-41bd-46f6-aa1c-edc8c43150d8	boolean	jsonType.label
c4bd154a-a2d6-4888-af25-ade3316d6107	true	introspection.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	true	userinfo.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	email	user.attribute
c4bd154a-a2d6-4888-af25-ade3316d6107	true	id.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	true	access.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	email	claim.name
c4bd154a-a2d6-4888-af25-ade3316d6107	String	jsonType.label
385e8a4f-a2aa-4231-9bab-dd18d9150083	formatted	user.attribute.formatted
385e8a4f-a2aa-4231-9bab-dd18d9150083	country	user.attribute.country
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	introspection.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	postal_code	user.attribute.postal_code
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	userinfo.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	street	user.attribute.street
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	id.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	region	user.attribute.region
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	access.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	locality	user.attribute.locality
56a12d7d-4891-48a5-b23d-195b558b8828	true	introspection.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	true	userinfo.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	phoneNumber	user.attribute
56a12d7d-4891-48a5-b23d-195b558b8828	true	id.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	true	access.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	phone_number	claim.name
56a12d7d-4891-48a5-b23d-195b558b8828	String	jsonType.label
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	introspection.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	userinfo.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	phoneNumberVerified	user.attribute
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	id.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	access.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	phone_number_verified	claim.name
8af9bfb7-caf4-454b-840b-0f5f2760968c	boolean	jsonType.label
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	introspection.token.claim
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	multivalued
3ee8f1f6-08fe-4821-8f09-02a22a065b57	foo	user.attribute
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	access.token.claim
3ee8f1f6-08fe-4821-8f09-02a22a065b57	realm_access.roles	claim.name
3ee8f1f6-08fe-4821-8f09-02a22a065b57	String	jsonType.label
5469604c-e44f-4181-8c10-88e9d7ac6209	true	introspection.token.claim
5469604c-e44f-4181-8c10-88e9d7ac6209	true	access.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	introspection.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	multivalued
abea88c9-f648-4395-97e1-46dfe8ec8faa	foo	user.attribute
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	access.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	resource_access.${client_id}.roles	claim.name
abea88c9-f648-4395-97e1-46dfe8ec8faa	String	jsonType.label
a7b67101-57b6-46f6-a7ee-0c2083718da9	true	introspection.token.claim
a7b67101-57b6-46f6-a7ee-0c2083718da9	true	access.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	introspection.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	multivalued
ade61f00-8330-4bdd-b393-ca139d5127ff	foo	user.attribute
ade61f00-8330-4bdd-b393-ca139d5127ff	true	id.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	access.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	groups	claim.name
ade61f00-8330-4bdd-b393-ca139d5127ff	String	jsonType.label
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	introspection.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	userinfo.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	username	user.attribute
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	id.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	access.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	upn	claim.name
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	String	jsonType.label
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	introspection.token.claim
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	id.token.claim
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	access.token.claim
32a33c6a-cdcd-45a5-9e80-42cf31689e49	true	introspection.token.claim
32a33c6a-cdcd-45a5-9e80-42cf31689e49	true	access.token.claim
a7f419e6-245b-4570-919d-ac39a70151c5	AUTH_TIME	user.session.note
a7f419e6-245b-4570-919d-ac39a70151c5	true	introspection.token.claim
a7f419e6-245b-4570-919d-ac39a70151c5	true	id.token.claim
a7f419e6-245b-4570-919d-ac39a70151c5	true	access.token.claim
a7f419e6-245b-4570-919d-ac39a70151c5	auth_time	claim.name
a7f419e6-245b-4570-919d-ac39a70151c5	long	jsonType.label
3ad576dd-3ede-4eac-938f-50e3791edd6c	false	single
3ad576dd-3ede-4eac-938f-50e3791edd6c	Basic	attribute.nameformat
3ad576dd-3ede-4eac-938f-50e3791edd6c	Role	attribute.name
03c2389f-8f91-4341-8a70-2a516729ddb4	true	introspection.token.claim
03c2389f-8f91-4341-8a70-2a516729ddb4	true	userinfo.token.claim
03c2389f-8f91-4341-8a70-2a516729ddb4	picture	user.attribute
03c2389f-8f91-4341-8a70-2a516729ddb4	true	id.token.claim
03c2389f-8f91-4341-8a70-2a516729ddb4	true	access.token.claim
03c2389f-8f91-4341-8a70-2a516729ddb4	picture	claim.name
03c2389f-8f91-4341-8a70-2a516729ddb4	String	jsonType.label
12b7662b-3939-4ed4-b05b-85db9293dfda	true	introspection.token.claim
12b7662b-3939-4ed4-b05b-85db9293dfda	true	userinfo.token.claim
12b7662b-3939-4ed4-b05b-85db9293dfda	birthdate	user.attribute
12b7662b-3939-4ed4-b05b-85db9293dfda	true	id.token.claim
12b7662b-3939-4ed4-b05b-85db9293dfda	true	access.token.claim
12b7662b-3939-4ed4-b05b-85db9293dfda	birthdate	claim.name
12b7662b-3939-4ed4-b05b-85db9293dfda	String	jsonType.label
1950336c-0153-4d6e-a0c0-4b6bafef971c	true	introspection.token.claim
1950336c-0153-4d6e-a0c0-4b6bafef971c	true	userinfo.token.claim
1950336c-0153-4d6e-a0c0-4b6bafef971c	firstName	user.attribute
1950336c-0153-4d6e-a0c0-4b6bafef971c	true	id.token.claim
1950336c-0153-4d6e-a0c0-4b6bafef971c	true	access.token.claim
1950336c-0153-4d6e-a0c0-4b6bafef971c	given_name	claim.name
1950336c-0153-4d6e-a0c0-4b6bafef971c	String	jsonType.label
4e87537f-4d0d-44c5-a0fd-c48fecf2232b	true	introspection.token.claim
4e87537f-4d0d-44c5-a0fd-c48fecf2232b	true	userinfo.token.claim
4e87537f-4d0d-44c5-a0fd-c48fecf2232b	true	id.token.claim
4e87537f-4d0d-44c5-a0fd-c48fecf2232b	true	access.token.claim
5af286c5-e399-4f0c-b52b-ed74b90196e3	true	introspection.token.claim
5af286c5-e399-4f0c-b52b-ed74b90196e3	true	userinfo.token.claim
5af286c5-e399-4f0c-b52b-ed74b90196e3	middleName	user.attribute
5af286c5-e399-4f0c-b52b-ed74b90196e3	true	id.token.claim
5af286c5-e399-4f0c-b52b-ed74b90196e3	true	access.token.claim
5af286c5-e399-4f0c-b52b-ed74b90196e3	middle_name	claim.name
5af286c5-e399-4f0c-b52b-ed74b90196e3	String	jsonType.label
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	true	introspection.token.claim
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	true	userinfo.token.claim
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	lastName	user.attribute
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	true	id.token.claim
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	true	access.token.claim
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	family_name	claim.name
711e9aa0-618c-4ee5-baa4-7ece0cc9ed6a	String	jsonType.label
72c0e454-0e79-445d-91ce-c988deecfb9c	true	introspection.token.claim
72c0e454-0e79-445d-91ce-c988deecfb9c	true	userinfo.token.claim
72c0e454-0e79-445d-91ce-c988deecfb9c	username	user.attribute
72c0e454-0e79-445d-91ce-c988deecfb9c	true	id.token.claim
72c0e454-0e79-445d-91ce-c988deecfb9c	true	access.token.claim
72c0e454-0e79-445d-91ce-c988deecfb9c	preferred_username	claim.name
72c0e454-0e79-445d-91ce-c988deecfb9c	String	jsonType.label
7748a3e2-cd3f-4ca0-b605-93b223aeea12	true	introspection.token.claim
7748a3e2-cd3f-4ca0-b605-93b223aeea12	true	userinfo.token.claim
7748a3e2-cd3f-4ca0-b605-93b223aeea12	gender	user.attribute
7748a3e2-cd3f-4ca0-b605-93b223aeea12	true	id.token.claim
7748a3e2-cd3f-4ca0-b605-93b223aeea12	true	access.token.claim
7748a3e2-cd3f-4ca0-b605-93b223aeea12	gender	claim.name
7748a3e2-cd3f-4ca0-b605-93b223aeea12	String	jsonType.label
8b5d7315-8f87-438b-a7a5-01aa018706fc	true	introspection.token.claim
8b5d7315-8f87-438b-a7a5-01aa018706fc	true	userinfo.token.claim
8b5d7315-8f87-438b-a7a5-01aa018706fc	updatedAt	user.attribute
8b5d7315-8f87-438b-a7a5-01aa018706fc	true	id.token.claim
8b5d7315-8f87-438b-a7a5-01aa018706fc	true	access.token.claim
8b5d7315-8f87-438b-a7a5-01aa018706fc	updated_at	claim.name
8b5d7315-8f87-438b-a7a5-01aa018706fc	long	jsonType.label
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	true	introspection.token.claim
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	true	userinfo.token.claim
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	profile	user.attribute
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	true	id.token.claim
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	true	access.token.claim
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	profile	claim.name
8ec1a82e-1327-4e07-8565-bc2cfcdb074a	String	jsonType.label
ac995a0b-6c2b-4f4b-8227-b16635193a9e	true	introspection.token.claim
ac995a0b-6c2b-4f4b-8227-b16635193a9e	true	userinfo.token.claim
ac995a0b-6c2b-4f4b-8227-b16635193a9e	website	user.attribute
ac995a0b-6c2b-4f4b-8227-b16635193a9e	true	id.token.claim
ac995a0b-6c2b-4f4b-8227-b16635193a9e	true	access.token.claim
ac995a0b-6c2b-4f4b-8227-b16635193a9e	website	claim.name
ac995a0b-6c2b-4f4b-8227-b16635193a9e	String	jsonType.label
b5f357c0-1e38-46da-b44e-6a8f05583799	true	introspection.token.claim
b5f357c0-1e38-46da-b44e-6a8f05583799	true	userinfo.token.claim
b5f357c0-1e38-46da-b44e-6a8f05583799	locale	user.attribute
b5f357c0-1e38-46da-b44e-6a8f05583799	true	id.token.claim
b5f357c0-1e38-46da-b44e-6a8f05583799	true	access.token.claim
b5f357c0-1e38-46da-b44e-6a8f05583799	locale	claim.name
b5f357c0-1e38-46da-b44e-6a8f05583799	String	jsonType.label
c740220d-a6d4-4580-b107-41187151f185	true	introspection.token.claim
c740220d-a6d4-4580-b107-41187151f185	true	userinfo.token.claim
c740220d-a6d4-4580-b107-41187151f185	zoneinfo	user.attribute
c740220d-a6d4-4580-b107-41187151f185	true	id.token.claim
c740220d-a6d4-4580-b107-41187151f185	true	access.token.claim
c740220d-a6d4-4580-b107-41187151f185	zoneinfo	claim.name
c740220d-a6d4-4580-b107-41187151f185	String	jsonType.label
cc1ee616-3a98-4acf-a690-2d2af33f8300	true	introspection.token.claim
cc1ee616-3a98-4acf-a690-2d2af33f8300	true	userinfo.token.claim
cc1ee616-3a98-4acf-a690-2d2af33f8300	nickname	user.attribute
cc1ee616-3a98-4acf-a690-2d2af33f8300	true	id.token.claim
cc1ee616-3a98-4acf-a690-2d2af33f8300	true	access.token.claim
cc1ee616-3a98-4acf-a690-2d2af33f8300	nickname	claim.name
cc1ee616-3a98-4acf-a690-2d2af33f8300	String	jsonType.label
29eaae7f-df01-4a3c-ac86-fd6948c5674b	true	introspection.token.claim
29eaae7f-df01-4a3c-ac86-fd6948c5674b	true	userinfo.token.claim
29eaae7f-df01-4a3c-ac86-fd6948c5674b	email	user.attribute
29eaae7f-df01-4a3c-ac86-fd6948c5674b	true	id.token.claim
29eaae7f-df01-4a3c-ac86-fd6948c5674b	true	access.token.claim
29eaae7f-df01-4a3c-ac86-fd6948c5674b	email	claim.name
29eaae7f-df01-4a3c-ac86-fd6948c5674b	String	jsonType.label
31eaa742-8f55-4c36-b745-3aad8863dbc3	true	introspection.token.claim
31eaa742-8f55-4c36-b745-3aad8863dbc3	true	userinfo.token.claim
31eaa742-8f55-4c36-b745-3aad8863dbc3	emailVerified	user.attribute
31eaa742-8f55-4c36-b745-3aad8863dbc3	true	id.token.claim
31eaa742-8f55-4c36-b745-3aad8863dbc3	true	access.token.claim
31eaa742-8f55-4c36-b745-3aad8863dbc3	email_verified	claim.name
31eaa742-8f55-4c36-b745-3aad8863dbc3	boolean	jsonType.label
a117eea7-1392-48af-88d3-f4558d446406	formatted	user.attribute.formatted
a117eea7-1392-48af-88d3-f4558d446406	country	user.attribute.country
a117eea7-1392-48af-88d3-f4558d446406	true	introspection.token.claim
a117eea7-1392-48af-88d3-f4558d446406	postal_code	user.attribute.postal_code
a117eea7-1392-48af-88d3-f4558d446406	true	userinfo.token.claim
a117eea7-1392-48af-88d3-f4558d446406	street	user.attribute.street
a117eea7-1392-48af-88d3-f4558d446406	true	id.token.claim
a117eea7-1392-48af-88d3-f4558d446406	region	user.attribute.region
a117eea7-1392-48af-88d3-f4558d446406	true	access.token.claim
a117eea7-1392-48af-88d3-f4558d446406	locality	user.attribute.locality
63c044b6-a178-4148-9bcd-7547fbcbec66	true	introspection.token.claim
63c044b6-a178-4148-9bcd-7547fbcbec66	true	userinfo.token.claim
63c044b6-a178-4148-9bcd-7547fbcbec66	phoneNumber	user.attribute
63c044b6-a178-4148-9bcd-7547fbcbec66	true	id.token.claim
63c044b6-a178-4148-9bcd-7547fbcbec66	true	access.token.claim
63c044b6-a178-4148-9bcd-7547fbcbec66	phone_number	claim.name
63c044b6-a178-4148-9bcd-7547fbcbec66	String	jsonType.label
9c324cff-5210-4a12-9bd1-7422011e0cc3	true	introspection.token.claim
9c324cff-5210-4a12-9bd1-7422011e0cc3	true	userinfo.token.claim
9c324cff-5210-4a12-9bd1-7422011e0cc3	phoneNumberVerified	user.attribute
9c324cff-5210-4a12-9bd1-7422011e0cc3	true	id.token.claim
9c324cff-5210-4a12-9bd1-7422011e0cc3	true	access.token.claim
9c324cff-5210-4a12-9bd1-7422011e0cc3	phone_number_verified	claim.name
9c324cff-5210-4a12-9bd1-7422011e0cc3	boolean	jsonType.label
6fbb9510-2076-4677-adc3-21138f8206b4	true	introspection.token.claim
6fbb9510-2076-4677-adc3-21138f8206b4	true	multivalued
6fbb9510-2076-4677-adc3-21138f8206b4	foo	user.attribute
6fbb9510-2076-4677-adc3-21138f8206b4	true	access.token.claim
6fbb9510-2076-4677-adc3-21138f8206b4	realm_access.roles	claim.name
6fbb9510-2076-4677-adc3-21138f8206b4	String	jsonType.label
ccf80e6a-3950-4328-91ce-5febe2823c00	true	introspection.token.claim
ccf80e6a-3950-4328-91ce-5febe2823c00	true	access.token.claim
d77b16cb-5893-4935-94aa-d702d85e1da3	true	introspection.token.claim
d77b16cb-5893-4935-94aa-d702d85e1da3	true	multivalued
d77b16cb-5893-4935-94aa-d702d85e1da3	foo	user.attribute
d77b16cb-5893-4935-94aa-d702d85e1da3	true	access.token.claim
d77b16cb-5893-4935-94aa-d702d85e1da3	resource_access.${client_id}.roles	claim.name
d77b16cb-5893-4935-94aa-d702d85e1da3	String	jsonType.label
8d5135ac-8e7b-4b4d-8732-bbe8c47ffdc6	true	introspection.token.claim
8d5135ac-8e7b-4b4d-8732-bbe8c47ffdc6	true	access.token.claim
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	true	introspection.token.claim
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	true	multivalued
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	foo	user.attribute
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	true	id.token.claim
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	true	access.token.claim
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	groups	claim.name
3c5c7c7f-8dfc-4c3e-99ce-dc128a71f019	String	jsonType.label
4e67af7c-77c0-441a-8c41-7db37023c8e5	true	introspection.token.claim
4e67af7c-77c0-441a-8c41-7db37023c8e5	true	userinfo.token.claim
4e67af7c-77c0-441a-8c41-7db37023c8e5	username	user.attribute
4e67af7c-77c0-441a-8c41-7db37023c8e5	true	id.token.claim
4e67af7c-77c0-441a-8c41-7db37023c8e5	true	access.token.claim
4e67af7c-77c0-441a-8c41-7db37023c8e5	upn	claim.name
4e67af7c-77c0-441a-8c41-7db37023c8e5	String	jsonType.label
642aa1fd-242e-44a3-a3ce-2bc78570baa1	true	introspection.token.claim
642aa1fd-242e-44a3-a3ce-2bc78570baa1	true	id.token.claim
642aa1fd-242e-44a3-a3ce-2bc78570baa1	true	access.token.claim
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	AUTH_TIME	user.session.note
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	true	introspection.token.claim
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	true	id.token.claim
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	true	access.token.claim
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	auth_time	claim.name
36a37ebf-1e5d-4462-a2be-5f44981a3b4c	long	jsonType.label
fea3c149-e0a9-4fb0-a822-f3134722cdbc	true	introspection.token.claim
fea3c149-e0a9-4fb0-a822-f3134722cdbc	true	access.token.claim
72b7ae67-7804-4666-9af8-3c7058c50564	true	introspection.token.claim
72b7ae67-7804-4666-9af8-3c7058c50564	true	multivalued
72b7ae67-7804-4666-9af8-3c7058c50564	true	id.token.claim
72b7ae67-7804-4666-9af8-3c7058c50564	true	access.token.claim
72b7ae67-7804-4666-9af8-3c7058c50564	organization	claim.name
72b7ae67-7804-4666-9af8-3c7058c50564	String	jsonType.label
640f97df-ea5b-4691-a60b-c98c161d33c8	true	introspection.token.claim
640f97df-ea5b-4691-a60b-c98c161d33c8	true	userinfo.token.claim
640f97df-ea5b-4691-a60b-c98c161d33c8	locale	user.attribute
640f97df-ea5b-4691-a60b-c98c161d33c8	true	id.token.claim
640f97df-ea5b-4691-a60b-c98c161d33c8	true	access.token.claim
640f97df-ea5b-4691-a60b-c98c161d33c8	locale	claim.name
640f97df-ea5b-4691-a60b-c98c161d33c8	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	21f9d306-af32-481c-9470-875328ef651d	ca82d390-f8c8-4105-9f7f-95f0442a4563	0f7db7b2-9608-4396-9da7-5ac0d23298e2	4166758c-a967-44ea-a50a-aead01198481	2592000	f	900	t	f	a9628e8a-0970-4232-9624-8e717c21b27f	0	f	0	0	cede3fb9-55db-49b4-a1ab-e107fd07dc5a
3dae0dec-5d92-4955-af55-89d9c775206b	60	300	300	\N	\N	\N	t	f	0	\N	measurestream	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	e6af9fc1-f8d6-4053-849d-2b44d236bf87	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	50fca9d0-d75f-41c8-b40e-3a4008a1b82d	85369751-981f-43ec-8615-17bee6e018f5	a5ea22ac-3bc7-4b80-9655-ea2faf3917d8	e3918048-6989-4172-8a52-75eeace095b0	edbd7083-d7b3-4713-a998-27662984b4f4	2592000	f	900	t	f	3dd6608e-13a6-48b6-96e7-55b71785ff53	0	f	0	0	0c97ab63-82ea-4743-8749-7ea17ed95d1c
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	767d9b8d-d1e0-46e8-8336-872e7ee443dd	
_browser_header.xContentTypeOptions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	nosniff
_browser_header.referrerPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	no-referrer
_browser_header.xRobotsTag	767d9b8d-d1e0-46e8-8336-872e7ee443dd	none
_browser_header.xFrameOptions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	SAMEORIGIN
_browser_header.contentSecurityPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1; mode=block
_browser_header.strictTransportSecurity	767d9b8d-d1e0-46e8-8336-872e7ee443dd	max-age=31536000; includeSubDomains
bruteForceProtected	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
permanentLockout	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
maxTemporaryLockouts	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0
maxFailureWaitSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	900
minimumQuickLoginWaitSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	60
waitIncrementSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	60
quickLoginCheckMilliSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1000
maxDeltaTimeSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	43200
failureFactor	767d9b8d-d1e0-46e8-8336-872e7ee443dd	30
realmReusableOtpCode	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
firstBrokerLoginFlowId	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5
displayName	767d9b8d-d1e0-46e8-8336-872e7ee443dd	Keycloak
displayNameHtml	767d9b8d-d1e0-46e8-8336-872e7ee443dd	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	RS256
offlineSessionMaxLifespanEnabled	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
offlineSessionMaxLifespan	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5184000
_browser_header.contentSecurityPolicyReportOnly	3dae0dec-5d92-4955-af55-89d9c775206b	
_browser_header.xContentTypeOptions	3dae0dec-5d92-4955-af55-89d9c775206b	nosniff
_browser_header.referrerPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	no-referrer
_browser_header.xRobotsTag	3dae0dec-5d92-4955-af55-89d9c775206b	none
_browser_header.xFrameOptions	3dae0dec-5d92-4955-af55-89d9c775206b	SAMEORIGIN
_browser_header.contentSecurityPolicy	3dae0dec-5d92-4955-af55-89d9c775206b	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	3dae0dec-5d92-4955-af55-89d9c775206b	1; mode=block
_browser_header.strictTransportSecurity	3dae0dec-5d92-4955-af55-89d9c775206b	max-age=31536000; includeSubDomains
bruteForceProtected	3dae0dec-5d92-4955-af55-89d9c775206b	false
permanentLockout	3dae0dec-5d92-4955-af55-89d9c775206b	false
maxTemporaryLockouts	3dae0dec-5d92-4955-af55-89d9c775206b	0
bruteForceStrategy	3dae0dec-5d92-4955-af55-89d9c775206b	MULTIPLE
maxFailureWaitSeconds	3dae0dec-5d92-4955-af55-89d9c775206b	900
minimumQuickLoginWaitSeconds	3dae0dec-5d92-4955-af55-89d9c775206b	60
waitIncrementSeconds	3dae0dec-5d92-4955-af55-89d9c775206b	60
quickLoginCheckMilliSeconds	3dae0dec-5d92-4955-af55-89d9c775206b	1000
maxDeltaTimeSeconds	3dae0dec-5d92-4955-af55-89d9c775206b	43200
failureFactor	3dae0dec-5d92-4955-af55-89d9c775206b	30
realmReusableOtpCode	3dae0dec-5d92-4955-af55-89d9c775206b	false
defaultSignatureAlgorithm	3dae0dec-5d92-4955-af55-89d9c775206b	RS256
offlineSessionMaxLifespanEnabled	3dae0dec-5d92-4955-af55-89d9c775206b	false
offlineSessionMaxLifespan	3dae0dec-5d92-4955-af55-89d9c775206b	5184000
actionTokenGeneratedByAdminLifespan	3dae0dec-5d92-4955-af55-89d9c775206b	43200
actionTokenGeneratedByUserLifespan	3dae0dec-5d92-4955-af55-89d9c775206b	300
oauth2DeviceCodeLifespan	3dae0dec-5d92-4955-af55-89d9c775206b	600
oauth2DevicePollingInterval	3dae0dec-5d92-4955-af55-89d9c775206b	5
webAuthnPolicyRpEntityName	3dae0dec-5d92-4955-af55-89d9c775206b	keycloak
webAuthnPolicySignatureAlgorithms	3dae0dec-5d92-4955-af55-89d9c775206b	ES256,RS256
webAuthnPolicyRpId	3dae0dec-5d92-4955-af55-89d9c775206b	
webAuthnPolicyAttestationConveyancePreference	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyAuthenticatorAttachment	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyRequireResidentKey	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyUserVerificationRequirement	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyCreateTimeout	3dae0dec-5d92-4955-af55-89d9c775206b	0
webAuthnPolicyAvoidSameAuthenticatorRegister	3dae0dec-5d92-4955-af55-89d9c775206b	false
webAuthnPolicyRpEntityNamePasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	ES256,RS256
webAuthnPolicyRpIdPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	
webAuthnPolicyAttestationConveyancePreferencePasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyRequireResidentKeyPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	not specified
webAuthnPolicyCreateTimeoutPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	3dae0dec-5d92-4955-af55-89d9c775206b	false
cibaBackchannelTokenDeliveryMode	3dae0dec-5d92-4955-af55-89d9c775206b	poll
cibaExpiresIn	3dae0dec-5d92-4955-af55-89d9c775206b	120
cibaInterval	3dae0dec-5d92-4955-af55-89d9c775206b	5
cibaAuthRequestedUserHint	3dae0dec-5d92-4955-af55-89d9c775206b	login_hint
parRequestUriLifespan	3dae0dec-5d92-4955-af55-89d9c775206b	60
firstBrokerLoginFlowId	3dae0dec-5d92-4955-af55-89d9c775206b	061bbc0a-edc7-44af-a20d-579bd98e7cfe
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	jboss-logging
3dae0dec-5d92-4955-af55-89d9c775206b	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	767d9b8d-d1e0-46e8-8336-872e7ee443dd
password	password	t	t	3dae0dec-5d92-4955-af55-89d9c775206b
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.redirect_uris (client_id, value) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	/realms/master/account/*
21f5e158-9ae0-47eb-a8af-5e5413d0f224	/realms/master/account/*
fec6b05c-1521-42c8-b5eb-e83a00d28125	/admin/master/console/*
d297f344-051c-4d34-8665-18b02a58d96c	/realms/measurestream/account/*
4f9520df-706f-40c5-a2d3-761c3be7b1bf	/realms/measurestream/account/*
947eed23-7adc-4635-b18e-9c151c1aa27c	/admin/measurestream/console/*
71d0319e-df6f-4a71-8f4a-353fc8b57122	http://localhost:8080/login/oauth2/code/gateway
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
dc4fa4a0-1cf7-4925-adae-c1e5cf537872	VERIFY_EMAIL	Verify Email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	VERIFY_EMAIL	50
2c5311d3-81e1-4086-b600-28a8b6a29b2a	UPDATE_PROFILE	Update Profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	UPDATE_PROFILE	40
4fdaa77f-36b1-4199-b1fd-981b79f5cdfb	CONFIGURE_TOTP	Configure OTP	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	CONFIGURE_TOTP	10
4f6e94f6-ef11-4242-bf48-51d9cec32e4e	UPDATE_PASSWORD	Update Password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	UPDATE_PASSWORD	30
a4308932-6d96-414e-a1f8-2bb9286f650c	TERMS_AND_CONDITIONS	Terms and Conditions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	f	TERMS_AND_CONDITIONS	20
59db076d-f7f1-4dd9-a153-d4d129610829	delete_account	Delete Account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	f	delete_account	60
b649097f-58af-44a5-a62a-d2ef6827241a	delete_credential	Delete Credential	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	delete_credential	100
1d0aec8f-c810-40ac-8a43-890668142f04	update_user_locale	Update User Locale	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	update_user_locale	1000
03084f2a-0129-47cb-a564-a6fd4e57acec	webauthn-register	Webauthn Register	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	webauthn-register	70
0363ffe1-dec5-4abf-9c33-5f4c5bc8970a	webauthn-register-passwordless	Webauthn Register Passwordless	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	webauthn-register-passwordless	80
db8df71f-affc-4c6a-be08-d8e5364ca8be	VERIFY_PROFILE	Verify Profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	VERIFY_PROFILE	90
44225536-7417-45f5-a73f-244e91b274a6	VERIFY_EMAIL	Verify Email	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	VERIFY_EMAIL	50
f4dbb448-91c3-4b3b-890f-5a5e51a4b2ac	UPDATE_PROFILE	Update Profile	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	UPDATE_PROFILE	40
31eaa9ae-b4ca-45df-9c92-0b9f835fc5f8	CONFIGURE_TOTP	Configure OTP	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	CONFIGURE_TOTP	10
2aef5ce7-4f41-482e-99f8-5d00c0b89f9f	UPDATE_PASSWORD	Update Password	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	UPDATE_PASSWORD	30
5b5a0963-679b-4a30-8f2a-8d03590ac89e	TERMS_AND_CONDITIONS	Terms and Conditions	3dae0dec-5d92-4955-af55-89d9c775206b	f	f	TERMS_AND_CONDITIONS	20
17791724-99a5-4fa6-81fd-96c0a28b0acc	delete_account	Delete Account	3dae0dec-5d92-4955-af55-89d9c775206b	f	f	delete_account	60
da957193-4f28-4429-ae30-ef1a46411ed0	delete_credential	Delete Credential	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	delete_credential	100
5929a2ac-1a75-443b-9488-8355a95ed09c	update_user_locale	Update User Locale	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	update_user_locale	1000
48debe7f-b920-4c3e-920d-73ca0f6c1a8a	webauthn-register	Webauthn Register	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	webauthn-register	70
1341fdbb-8b68-4ed1-9960-21746fb92c10	webauthn-register-passwordless	Webauthn Register Passwordless	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	webauthn-register-passwordless	80
ffb20b11-1a36-4548-865d-01f254227ed0	VERIFY_PROFILE	Verify Profile	3dae0dec-5d92-4955-af55-89d9c775206b	t	f	VERIFY_PROFILE	90
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: revoked_token; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.revoked_token (id, expire) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
21f5e158-9ae0-47eb-a8af-5e5413d0f224	3e7aa68c-3e39-40fe-add5-feea461c5b2b
21f5e158-9ae0-47eb-a8af-5e5413d0f224	b96ee64d-e253-423d-ba83-74f97ac4c3c9
4f9520df-706f-40c5-a2d3-761c3be7b1bf	6e381440-d0f7-4bef-a276-340991bf8c7f
4f9520df-706f-40c5-a2d3-761c3be7b1bf	c33cd985-c2a5-46f0-bbe8-a84bcac55442
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_attribute (name, value, user_id, id, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
5addde5e-fc0d-4716-bb94-47bdd9e711c4	\N	6725582d-cbf1-4627-bb05-e05237a51296	f	t	\N	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	admin	1740481503286	\N	0
1d445807-c24e-4513-884d-22451ce9cf67	polito@polito.it	polito@polito.it	t	t	\N	polito	polito	3dae0dec-5d92-4955-af55-89d9c775206b	polito	1740493708847	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_group_membership (group_id, user_id, membership_type) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	5addde5e-fc0d-4716-bb94-47bdd9e711c4
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5addde5e-fc0d-4716-bb94-47bdd9e711c4
0c97ab63-82ea-4743-8749-7ea17ed95d1c	1d445807-c24e-4513-884d-22451ce9cf67
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.web_origins (client_id, value) FROM stdin;
fec6b05c-1521-42c8-b5eb-e83a00d28125	+
947eed23-7adc-4635-b18e-9c151c1aa27c	+
71d0319e-df6f-4a71-8f4a-353fc8b57122	http://localhost:8080
\.


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: org_domain ORG_DOMAIN_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.org_domain
    ADD CONSTRAINT "ORG_DOMAIN_pkey" PRIMARY KEY (id, name);


--
-- Name: org ORG_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "ORG_pkey" PRIMARY KEY (id);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: revoked_token constraint_rt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.revoked_token
    ADD CONSTRAINT constraint_rt PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: user_consent uk_external_consent; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_external_consent UNIQUE (client_storage_provider, external_client_id, user_id);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_local_consent; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_local_consent UNIQUE (client_id, user_id);


--
-- Name: org uk_org_alias; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_alias UNIQUE (realm_id, alias);


--
-- Name: org uk_org_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_group UNIQUE (group_id);


--
-- Name: org uk_org_name; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_name UNIQUE (realm_id, name);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: fed_user_attr_long_values; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX fed_user_attr_long_values ON public.fed_user_attribute USING btree (long_value_hash, name);


--
-- Name: fed_user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX fed_user_attr_long_values_lower_case ON public.fed_user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, substr(value, 1, 255));


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_idp_for_login; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_idp_for_login ON public.identity_provider USING btree (realm_id, enabled, link_only, hide_on_login, organization_id);


--
-- Name: idx_idp_realm_org; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_idp_realm_org ON public.identity_provider USING btree (realm_id, organization_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_uss_by_broker_session_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_by_broker_session_id ON public.offline_user_session USING btree (broker_session_id, realm_id);


--
-- Name: idx_offline_uss_by_last_session_refresh; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_by_last_session_refresh ON public.offline_user_session USING btree (realm_id, offline_flag, last_session_refresh);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_org_domain_org_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_org_domain_org_id ON public.org_domain USING btree (org_id);


--
-- Name: idx_perm_ticket_owner; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_perm_ticket_owner ON public.resource_server_perm_ticket USING btree (owner);


--
-- Name: idx_perm_ticket_requester; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_perm_ticket_requester ON public.resource_server_perm_ticket USING btree (requester);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_rev_token_on_expire; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_rev_token_on_expire ON public.revoked_token USING btree (expire);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_usconsent_scope_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usconsent_scope_id ON public.user_consent_client_scope USING btree (scope_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: user_attr_long_values; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX user_attr_long_values ON public.user_attribute USING btree (long_value_hash, name);


--
-- Name: user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX user_attr_long_values_lower_case ON public.user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

