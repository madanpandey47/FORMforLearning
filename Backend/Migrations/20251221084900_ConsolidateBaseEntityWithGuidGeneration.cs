using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FormBackend.Migrations
{
    /// <inheritdoc />
    public partial class ConsolidateBaseEntityWithGuidGeneration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Parents",
                table: "Parents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AcademicHistories",
                table: "AcademicHistories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AcademicEnrollments",
                table: "AcademicEnrollments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AcademicHistories");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AcademicEnrollments");

            migrationBuilder.AddColumn<Guid>(
                name: "PID",
                table: "Parents",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "PID",
                table: "AcademicHistories",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "PID",
                table: "AcademicEnrollments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // Update each table to have unique GUIDs
            migrationBuilder.Sql("UPDATE [Parents] SET [PID] = NEWID()");
            migrationBuilder.Sql("UPDATE [AcademicHistories] SET [PID] = NEWID()");
            migrationBuilder.Sql("UPDATE [AcademicEnrollments] SET [PID] = NEWID()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Parents",
                table: "Parents",
                column: "PID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AcademicHistories",
                table: "AcademicHistories",
                column: "PID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AcademicEnrollments",
                table: "AcademicEnrollments",
                column: "PID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Parents",
                table: "Parents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AcademicHistories",
                table: "AcademicHistories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AcademicEnrollments",
                table: "AcademicEnrollments");

            migrationBuilder.DropColumn(
                name: "PID",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "PID",
                table: "AcademicHistories");

            migrationBuilder.DropColumn(
                name: "PID",
                table: "AcademicEnrollments");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Parents",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AcademicHistories",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AcademicEnrollments",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Parents",
                table: "Parents",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AcademicHistories",
                table: "AcademicHistories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AcademicEnrollments",
                table: "AcademicEnrollments",
                column: "Id");
        }
    }
}
