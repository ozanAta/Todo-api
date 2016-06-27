/**
* Created by ekinca on 23.06.2016.
*/
import {Component, OnInit, OnDestroy, OnChanges, AfterViewInit, Injectable, ElementRef, ViewContainerRef, ViewChild, ComponentRef, ChangeDetectorRef, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptionsArgs, Response} from "../node_modules/angular2/http";
import {BasePage} from "./commons/BasePage";
import {PageServices} from "./modules/PageServices";
import {DIALOG_TYPES} from "./modules/UIHelper";
import {topoConfig} from "./TopologyPage";
import {DocumentConverter} from "./modules/DocumentConverter";
import {AddressInfo} from "./swagger/AddressInfo";
import {SharedService} from "./modules/SharedService";

//Example infoTooltipData = {mode:tooltipMode.TOPOLOGYELEMENTS, data:d};

export enum tooltipMode {
    MOUSEOUT,
    TOPOLOGYELEMENTS,
    CONTROLLER
}


@Component({
    selector: 'info-tooltip-widget',
    templateUrl: '../pagehtmls/InfoTooltipWidget.html'
})
export class InfoTooltipWidget extends BasePage implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    @Input() infoTooltipData;

    elementRef: ElementRef;
    private statsTooltipDiv;

    constructor(elementRef: ElementRef, baseServices: PageServices, private documentConverter: DocumentConverter, private sharedService: SharedService) {
        super(baseServices, elementRef);
        this.elementRef = elementRef;
        this.setI18NKey('network_vis.topology');

        this.sharedService.infoTooltipEvent.subscribe((e) => {
            this.infoTooltipData = { mode: tooltipMode.CONTROLLER, data: e };
            this.prepareTooltipData();
        });
    }

    ngOnChanges(e) {
        super.ngOnChanges(e);
        if (e.infoTooltipData.currentValue) {
            if (e.infoTooltipData.currentValue.mode === tooltipMode.MOUSEOUT) {
                if (this.statsTooltipDiv) {
                    this.statsTooltipDiv.stop().animate({ opacity: 0 }, 3000, () => {
                        this.statsTooltipDiv.html("");
                    });
                }
            } else if (e.infoTooltipData.currentValue.mode === tooltipMode.TOPOLOGYELEMENTS) {
                this.prepareTooltipData();
            } else {
                console.log("unknown tooltip mode");
            }
        } else {
            console.log("currentValue is not defined");
        }
    }

    tableFieldMaker(tableFields, d) {
        var tableString = "";
        for (let i = 0; i < tableFields.length; i++) {
            if (d[tableFields[i]])
                tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.node_properties." + tableFields[i]) + ":</span> " + d[tableFields[i]] + "<br>";
        }
        return tableString;
    }



    prepareTooltipData() {

        var d = this.infoTooltipData.data;

        if (d) {
            if (d.type === "Switch") {

                var tableString = "<span class=tool-head>" + $.t("network_vis.switch.title") + "</span><br><br>";
                tableString += this.tableFieldMaker(["id", "status"], d);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.address)) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.address") + ":</span> " + this.renderAddresses(d.address);
                if (d.deviceInfo.model) {
                    let model = d.deviceInfo.model == "None" ? "" : d.deviceInfo.model;
                    tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.device_info") + ":</span> <span>" + model + " " + d.deviceInfo.vendor + "<br>" + d.deviceInfo.swVersion + "P</span><br>";
                }
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.supports)) { if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.supports.openFlow)) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.support") + ":</span> <span>" + d.supports.openFlow + "</span><br>"; }

                tableString += this.tableFieldMaker(["securityLevel", "activeSince", "powerUsage", "flows"], d);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.portInfo)) tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.port_info") + ":</span> <span style='color: green'>" + (d.portInfo.activePorts || 0) + "</span>/<span style='color: orange'>" + (d.portInfo.passivePorts || 0) + "</span>/" + (d.portInfo.totalPorts || 0) + "<br>";

                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.stats)) {
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.stats.packets)) {
                        tableString += "<hr><table border='1' class='stats-table'>"
                            + "<tr><th rowspan='1'>"
                            + "<th>" + $.t("network_vis.topology.statistics.received") + "<th>" + $.t("network_vis.topology.statistics.sent")
                            + "<tr><th>" + $.t("network_vis.topology.statistics.packet") + "<td>" + this.documentConverter.formatPackets(d.stats.packets.received) + "<td>" + this.documentConverter.formatPackets(d.stats.packets.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.error") + "<td>" + this.documentConverter.formatPackets(d.stats.packetErrors.received) + "<td>" + this.documentConverter.formatPackets(d.stats.packetErrors.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.drop") + "<td>" + this.documentConverter.formatPackets(d.stats.packetDrops.received) + "<td>" + this.documentConverter.formatPackets(d.stats.packetDrops.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.byte") + "<td>" + this.documentConverter.formatBytes(d.stats.bytes.received) + "<td>" + this.documentConverter.formatBytes(d.stats.bytes.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.collisions") + "<td colspan='2' style='text-align: center'>" + d.stats.collisions;
                    }
                }

                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.bandwidth) && typeof d.load !== "undefined") tableString += "<tr><th>" + $.t("network_vis.topology.statistics.bandwidth") + "<td colspan='2' style='text-align: center'>" + this.documentConverter.formatBandwidth(d.bandwidth);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.load)) tableString += "<tr><th>" + $.t("network_vis.topology.statistics.load") + "<td colspan='2' style='text-align: center'>" + d.load;

                tableString += "</table>";

                this.statsTooltipDiv.html(tableString);
                // this.footer = {type:"switch", data:d};

            } else if (this.documentConverter.isHost(d.type)) {
                //beginning of tooltip
                var tableString = "<span class=tool-head>" + $.t("network_vis.host") + "</span><br><br>";
                tableString += this.tableFieldMaker(["id", "name", "status"], d);

                if (d.address) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.address") + "</span> " + this.renderAddresses(d.address);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port)) {
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.number)) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.port_info") + ":</span> " + d.port.number
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.status)) tableString += "/<span class=tool-info-head>" + $.t("common.status") + ":</span> " + d.port.status
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.address)) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.address") + ":</span> " + this.renderAddresses(d.port.address)
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.speed)) {
                        if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.speed.current)) tableString += "<br><span class=tool-info-head>" + $.t("network_vis.topology.cspeed") + ":</span> " + d.port.speed.current
                        if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.speed.max)) tableString += "/<span class=tool-info-head>" + $.t("network_vis.topology.mspeed") + ":</span> " + d.port.speed.max;
                    }
                }
                tableString += this.tableFieldMaker(["securityLevel", "activeSince", "lastSeen"], d);

                //beginning of stats table
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port)) {
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.port.stats)) {
                        if(d.port.stats.packets){
                            tableString += "<hr><table border='1' class='stats-table'>"
                                + "<tr><th rowspan='1'>"
                                + "<th>" + $.t("network_vis.topology.statistics.received") + "<th>" + $.t("network_vis.topology.statistics.sent")
                                + "<tr><th>" + $.t("network_vis.topology.statistics.packet") + "<td>" + this.documentConverter.formatPackets(d.port.stats.packets.received) + "<td>" + this.documentConverter.formatPackets(d.port.stats.packets.sent)
                                + "<tr><th>" + $.t("network_vis.topology.statistics.error") + "<td>" + this.documentConverter.formatPackets(d.port.stats.packetErrors.received) + "<td>" + this.documentConverter.formatPackets(d.port.stats.packetErrors.sent)
                                + "<tr><th>" + $.t("network_vis.topology.statistics.drop") + "<td>" + this.documentConverter.formatPackets(d.port.stats.packetDrops.received) + "<td>" + this.documentConverter.formatPackets(d.port.stats.packetDrops.sent)
                                + "<tr><th>" + $.t("network_vis.topology.statistics.byte") + "<td>" + this.documentConverter.formatBytes(d.port.stats.bytes.received) + "<td>" + this.documentConverter.formatBytes(d.port.stats.bytes.sent)
                                + "<tr><th>" + $.t("network_vis.topology.statistics.collisions") + "<td colspan='2' style='text-align: center'>" + d.port.stats.collisions;
                        }
                    }
                }

                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.bandwidth))tableString += "<tr><th>" + $.t("network_vis.topology.statistics.bandwidth") + "<td colspan='2' style='text-align: center'>" + this.documentConverter.formatBandwidth(d.bandwidth);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.load))tableString += "<tr><th>" + $.t("network_vis.topology.statistics.load") + "<td colspan='2' style='text-align: center'>" + d.load;
                //end of stats table
                tableString += "</table>";

                this.statsTooltipDiv.html(tableString);
                // this.footer = {type:"host", data:d, address: this.renderAddresses(d.port.address)};
            } else if (d.type === "Link") {
                //beginning of tooltip
                var tableString = "<span class=tool-head>" + $.t("network_vis.link") + "</span><br><br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.linkId)) tableString += "<span class=tool-info-head>ID:</span> " + d.linkId + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.status)) tableString += "<span class=tool-info-head>" + $.t("common.status") + ":</span> " + d.status + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.srcPort.number))tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.source_port") + ":</span> " + d.srcPort.number + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.destPort.number))tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.dest_port") + ":</span> " + d.destPort.number + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.signalQuality))tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.signal_quality") + ":</span> " + d.signalQuality + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.loss) && this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.delay) && this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.jitter))"<span class=tool-info-head>" + $.t("network_vis.topology.loss") + "/" + $.t("network_vis.topology.delay") + "/" + $.t("network_vis.topology.jitter") + ":</span> " + d.loss + "/" + d.delay + "/" + d.jitter + "<br>";
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.bandwidthUtilization))tableString += "<span class=tool-info-head>" + $.t("network_vis.topology.node_properties.bandwidthUtilization") + ":</span> " + (Math.round(d.bandwidthUtilization * 100)) + "%<br>";

                //beginning of stats table
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.srcPort.stats)) {
                    if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.srcPort.stats.packets)) {
                        tableString += "<hr><table border='1' class='stats-table'>"
                            + "<tr><th rowspan='2'>"
                            + "<th colspan='2' style='text-align: center;'> " + $.t("network_vis.topology.statistics.source") + "<th colspan='2' style='text-align: center;'> " + $.t("network_vis.topology.statistics.dest")
                            + "<tr><th>" + $.t("network_vis.topology.statistics.received") + "<th>" + $.t("network_vis.topology.statistics.sent") + "<th>" + $.t("network_vis.topology.statistics.received") + "<th>" + $.t("network_vis.topology.statistics.sent")
                            + "<tr><th>" + $.t("network_vis.topology.statistics.packet") + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packets.received) + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packets.sent) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packets.received) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packets.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.error") + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packetErrors.received) + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packetErrors.sent) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packetErrors.received) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packetErrors.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.drop") + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packetDrops.received) + "<td>" + this.documentConverter.formatPackets(d.srcPort.stats.packetDrops.sent) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packetDrops.received) + "<td>" + this.documentConverter.formatPackets(d.destPort.stats.packetDrops.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.byte") + "<td>" + this.documentConverter.formatBytes(d.srcPort.stats.bytes.received) + "<td>" + this.documentConverter.formatBytes(d.srcPort.stats.bytes.sent) + "<td>" + this.documentConverter.formatBytes(d.destPort.stats.bytes.received) + "<td>" + this.documentConverter.formatBytes(d.destPort.stats.bytes.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.rate") + "<td>" + this.documentConverter.formatBandwidth(d.srcPort.stats.rates.received) + "<td>" + this.documentConverter.formatBandwidth(d.srcPort.stats.rates.sent) + "<td>" + this.documentConverter.formatBandwidth(d.destPort.stats.rates.received) + "<td>" + this.documentConverter.formatBandwidth(d.destPort.stats.rates.sent)
                            + "<tr><th>" + $.t("network_vis.topology.statistics.collisions") + "<td colspan='2' style='text-align: center'>" + d.srcPort.stats.collisions + "<td colspan='2' style='text-align: center'>" + d.srcPort.stats.collisions;
                    }
                }
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.bandwidth))tableString += "<tr><th>" + $.t("network_vis.topology.statistics.bandwidth") + "<td colspan='2' style='text-align: center'>" + this.documentConverter.formatBandwidth(d.bandwidth);
                if (this.documentConverter.isNotNullOrUndefinedOrEmptyString(d.load))tableString += "<tr><th>" + $.t("network_vis.topology.statistics.load") + "<td colspan='2' style='text-align: center'>" + d.load;
                //end of stats table
                tableString += "</table>";

                this.statsTooltipDiv.html(tableString);
                // this.footer = {type:"link", data: d};
            } else if (d.isController) {
                let controllerInfo = [ "<span class=tool-head>" + $.t("network_vis.topology.controller_properties.controller") + "</span><br><br>" ];
                if(d.name)controllerInfo.push("<span class=tool-info-head>" + $.t("network_vis.topology.controller_properties.name") + "</span>: " + d.name);
                if(d.address && d.address.ipv4) controllerInfo.push("<br><span class=tool-info-head>" + $.t("network_vis.topology.controller_properties.ip") + "</span>: " + this.renderAddresses(d.address) );
                if(d.deviceCount) controllerInfo.push("<br><span class=tool-info-head>" + $.t("network_vis.topology.controller_properties.deviceCount") + "</span>: " + d.deviceCount);
                if(d.securityMode) controllerInfo.push("<br><span class=tool-info-head>" + $.t("network_vis.topology.controller_properties.securityMode") + "</span>: " + d.securityMode);
                controllerInfo.join(" ");
                this.statsTooltipDiv.html(controllerInfo);
            }
           // return this.tooltipDiv.i18n();
            return this.statsTooltipDiv.stop().css("opacity", 0.9);
        }
    }

    private renderAddresses(address:AddressInfo) {
        let strBufer = [];
        if (address) {
            //'mac', mac is used in ID field so no need to show here
            ['ipv4', 'ipv6'].forEach((fld)=> {
                if (address[fld]) strBufer.push(address[fld]);
            })
        }
        return strBufer.length > 0 ? strBufer.join('/') : '-';
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        if (super.ngAfterViewInit()) {
            this.statsTooltipDiv = $(".info-tooltip-widget");
            return true;
        }
        return false;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
